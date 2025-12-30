import { useState } from 'react';
import { View, Text, ScrollView, StatusBar, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useTasksApi } from '@/api/taskApi';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import TaskCard from '@/components/TaskCard';

const TasksScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const { useGetTasks } = useTasksApi();
  const { data: response, isLoading, isError, error, isFetching, refetch } = useGetTasks();

  const tasks = response?.data || [];

  const handleLogout = () => {
    if (loggingOut) return;

    Alert.alert(
      "Logout",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            try {
              await signOut();
              //   router.replace('/');
            } catch (error) {
              setLoggingOut(false);
              console.error("Logout Error:", error);
              Alert.alert("Error", "Failed to sign out");
            }
          }
        }
      ]
    );
  };

  if (isLoading) return <Loading text='Loading Tasks' />;
  if (isError) return <Error error={error} refetch={refetch} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4f46e5' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <ScrollView
        className="flex-1 bg-back"
        contentContainerClassName="px-3.5 pt-7 gap-10"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={['#4f46e5']}
            tintColor={'#4f46e5'}
          />
        }
      >
        {/* Header */}
        <Header
          title="Tasks List"
          subtitle="My Productivity"
          iconName="log-out"
          onPress={handleLogout}
          isLoading={loggingOut}
        />
        {/* Stats Cards */}
        <View className="flex-row items-center gap-2.5">
          <View className="h-30 p-2.5 flex-1 justify-between gap-2.5 rounded-2xl bg-white border border-gray-100 shadow shadow-blue-100">
            <View className="w-full h-12 bg-blue-50 items-center justify-center rounded-lg">
              <Ionicons name="layers" size={20} color="#4f46e5" />
            </View>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-xl font-medium text-gray-900">{tasks.length}</Text>
              <Text className="text-xs text-gray-500">Total</Text>
            </View>
          </View>
          <View className="p-2.5 flex-1 justify-between gap-2.5 rounded-2xl bg-gray-900 border border-gray-100 shadow shadow-blue-100">
            <View className="w-full h-14 bg-[#10b981]/20 items-center justify-center rounded-lg">
              <Ionicons name="checkmark-circle" size={35} color="#10b981" />
            </View>
            <View className="flex-row justify-center items-baseline gap-2.5 text-center">
              <Text className="text-2xl font-medium text-white">{tasks.filter(t => t.isCompleted).length}</Text>
              <Text className="text-sm text-gray-500">Done</Text>
            </View>
          </View>
          <View className="h-30 p-2.5 flex-1 justify-between gap-2.5 rounded-2xl bg-white border border-gray-100 shadow shadow-blue-100">
            <View className="w-full h-12 bg-orange-50 items-center justify-center rounded-lg">
              <Ionicons name="flash-outline" size={20} color="#f97316" />
            </View>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-xl font-medium text-gray-900">{tasks.filter(t => !t.isCompleted).length}</Text>
              <Text className="text-xs text-gray-500">Left</Text>
            </View>
          </View>
        </View>
        {/* Tasks List */}
        <View className="p-5 gap-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Current Roadmap</Text>
            <Text className="text-xs text-gray-500">Your upcoming milestones</Text>
          </View>
          {
            tasks.length === 0 ? (
              <View className="px-5 py-10 justify-center items-center text-center">
                <Text className="font-light text-gray-500">No tasks in your roadmap yet!</Text>
              </View>
            ) : (
              <View className="gap-5">
                {
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                    />
                  ))
                }
              </View>
            )
          }
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView >
  );
}

export default TasksScreen;