import { View, Text, ScrollView, TouchableOpacity, Switch, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { useTasksApi } from '@/api/taskApi';
import { getPriorityColor } from '@/utils/helpers';
import InnerHeader from '@/components/InnerHeader';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

const TaskDetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { useDeleteTask, useGetTask, useToggleSubtaskStatus, useToggleTaskStatus } = useTasksApi();
  const { data: response, isLoading, isError, error, refetch } = useGetTask(id as string);
  const { mutate: toggleTask } = useToggleTaskStatus();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: toggleSubtask } = useToggleSubtaskStatus();

  const task = response?.data;

  const isOverdue = task?.dueDate && isPast(new Date(task.dueDate)) && !task.isCompleted;

  const handleToggleStatus = (value: boolean) => {
    if (!task) return;

    const alertTitle = value ? "Complete Task" : "Reopen Task";
    const alertMessage = value ? "Mark this task as completed?" : "Move task back to progress?";

    Alert.alert(
      alertTitle,
      alertMessage,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          onPress: () => {
            toggleTask({ id: task._id }, {
              onSuccess: (res) => {
                // Toast.show({
                //   type: 'success',
                //   text1: 'Success',
                //   text2: res.message
                // });
              },
              onError: (err) => {
                Toast.show({
                  type: 'error',
                  text1: 'Update Failed',
                  text2: err.message
                });
              }
            });
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert(
      "Delete Task",
      "This action cannot be undone. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          style: "destructive",
          onPress: () => {
            deleteTask({ id: task._id }, {
              onSuccess: (res) => {
                // Toast.show({
                //   type: 'success',
                //   text1: 'Success',
                //   text2: res.message
                // });
                router.back();
              },
              onError: (err) => {
                Toast.show({
                  type: 'error',
                  text1: 'Update Failed',
                  text2: err.message
                });
              }
            });
          }
        }
      ]
    );
  };

  if (isLoading) return <Loading text='Loading Task' />;
  if (isError || !task) return <Error error={error} refetch={refetch} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4f46e5' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <View className="px-5 pt-7 pb-3.5 flex-1 -gap-5 bg-white">
        {/* Inner Header */}
        <InnerHeader
          title="Task Details"
          showRightIcon={false}
        />
        {/* Task Data */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="gap-10 py-5"
        >
          {/* Title & Description & Due Date Card */}
          <View className="gap-2.5">
            <Text className="text-xl font-medium text-gray-900">{task.title}</Text>
            {
              task.content &&
              <Text className="text-sm text-gray-500">{task.content}</Text>
            }
            <View className="mt-5 px-2.5 py-3.5 flex-row items-center gap-3.5 bg-back/50 rounded-xl border border-gray-100">
              <View
                className={`rounded-full border ${isOverdue
                  ? 'p-2.5 bg-red-50 border-red-100'
                  : 'p-3.5 bg-indigo-50 border-indigo-100'
                  }`}
              >
                <Ionicons
                  name={isOverdue ? "alert-circle" : "calendar"}
                  size={isOverdue ? 25 : 20}
                  color={isOverdue ? "#ef4444" : "#4f46e5"}
                />
              </View>
              <View className='gap-1.5 '>
                <Text className="text-sm font-medium text-gray-900">Due Date</Text>
                <Text className="text-xs text-gray-500">
                  {task.dueDate ? format(new Date(task.dueDate), 'EEEE, dd MMMM, yyyy') : 'No date set'}
                </Text>
                {
                  task.dueDate && !task.isCompleted && (
                    <Text className={`text-xs ${isOverdue ? 'text-red-500' : 'text-indigo-600'}`}>
                      {
                        isPast(new Date(task.dueDate))
                          ? `(Overdue by ${formatDistanceToNow(new Date(task.dueDate))})`
                          : `(Ends in ${formatDistanceToNow(new Date(task.dueDate))})`
                      }
                    </Text>
                  )
                }
              </View>
            </View>
          </View>
          {/* Status & Priority*/}
          <View className="flex-row justify-between items-center">
            <View className="flex-row justify-end items-center gap-0.5">
              <Switch
                value={task.isCompleted}
                onValueChange={handleToggleStatus}
                trackColor={{ false: "#6b7280", true: "#4f46e5" }}
                thumbColor="#fff"
                ios_backgroundColor="#6b7280"
              />
              <Text className="text-sm text-gray-500 uppercase">
                {task.isCompleted ? "Completed" : "Complete"}
              </Text>
            </View>
            <View style={{ borderColor: getPriorityColor(task.priority) }} className="px-3.5 py-2.5 bg-back/50 rounded-lg border">
              <Text style={{ color: getPriorityColor(task.priority) }} className="text-xs uppercase">
                {task.priority} Priority
              </Text>
            </View>
          </View>
          {/* Sub Tasks */}
          {
            task.subTasks.length > 0 &&
            <View className="gap-2.5">
              <Text className="text-lg font-bold text-gray-900">Sub Tasks</Text>
              <View className="gap-2.5">
                {
                  task.subTasks.map((sub) => (
                    <View key={sub._id} className="px-2.5 py-5 flex-row items-center gap-2.5 bg-back/50 rounded-xl border border-gray-100">
                      <TouchableOpacity
                        onPress={() => {
                          if (task?._id && sub?._id) {
                            toggleSubtask({
                              taskId: task._id,
                              subId: sub._id
                            });
                          }
                        }}
                        className={`w-7 h-7 items-center justify-center rounded border ${sub.isDone ? 'bg-indigo-50 border-indigo-500' : 'border-gray-300'}`}
                      >
                        {
                          sub.isDone && (
                            <Ionicons name="checkmark" size={20} color="#4f46e5" />
                          )
                        }
                      </TouchableOpacity>
                      <Text className={`flex-1 text-sm ${sub.isDone ? 'text-gray-500 line-through' : 'text-gray-900 font-medium'}`}>
                        {sub.title}
                      </Text>
                    </View>
                  ))
                }
              </View>
            </View>
          }
        </ScrollView>
        {/* Delete Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDelete}
          className="p-3.5 rounded-xl flex-row justify-center items-center gap-2.5 bg-red-500"
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text className="text-sm font-medium text-white">Delete Task</Text>
        </TouchableOpacity>
      </View >
    </SafeAreaView >
  );
}

export default TaskDetailsScreen;