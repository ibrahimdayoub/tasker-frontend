import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns/format';
import { Task } from '@/types/task';
import { getPriorityColor } from '@/utils/helpers';

interface TaskCardProps {
    task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            key={task._id}
            onPress={() => router.push({
                pathname: "/task/[id]",
                params: { id: task._id }
            })}
            style={{ borderColor: getPriorityColor(task.priority) }}
            className={`p-5 flex-row items-center gap-5 bg-back/25 rounded-lg border-s-2`}
        >
            <View className="flex-1 gap-2.5">
                <View className="flex-row items-center gap-2.5">
                    <Text
                        numberOfLines={1}
                        className={`max-w-60 text-base ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 font-bold'}`}
                    >
                        {task.title}
                    </Text>
                </View>
                <View className="flex-row items-center gap-5">
                    <View className="flex-row items-center gap-2.5">
                        <Ionicons name="calendar-outline" size={15} color="#6b7280" />
                        <Text className="text-xs text-gray-500">
                            {
                                task.dueDate
                                    ? format((task.dueDate), 'dd MMM, yyyy')
                                    : 'No date'
                            }
                        </Text>
                    </View>
                    {task.subTasks.length > 0 && (
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="git-network-outline" size={15} color="#6b7280" />
                            <Text className="text-xs text-gray-500">
                                {task.subTasks.filter((s: { isDone: boolean }) => s.isDone).length}/{task.subTasks.length}
                            </Text>
                        </View>
                    )}
                    {
                        task.isCompleted && (
                            <Ionicons name="checkmark-done" size={15} color="#10b981" />
                        )
                    }
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>
    );
};

export default TaskCard;