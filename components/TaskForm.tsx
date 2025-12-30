import React, { memo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from "react-native-modal";
import { Calendar } from 'react-native-calendars';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTasksApi } from '@/api/taskApi';
import { getPriorityColor } from '@/utils/helpers';

const TaskForm = memo(() => {
    const router = useRouter();

    const { useCreateTask } = useTasksApi();
    const { mutate: createTask, isPending } = useCreateTask();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState(new Date());
    const [subTasks, setSubTasks] = useState([{ title: '', isDone: false }]);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date: Date) => {
        setDueDate(date);
        hideDatePicker();
    };

    const addSubTask = () => {
        const lastSubTask = subTasks[subTasks.length - 1];

        if (lastSubTask && lastSubTask.title.trim() === '') {
            return;
        }

        setSubTasks([
            ...subTasks,
            { title: '', isDone: false }
        ]);
    };

    const updateSubTask = (tite: string, index: number) => {
        const newSt = [...subTasks];
        newSt[index].title = tite;
        setSubTasks(newSt);
    };

    const removeSubTask = (index: number) => {
        if (subTasks.length > 1) {
            setSubTasks(subTasks.filter((_, i) => i !== index));
        } else {
            setSubTasks([{ title: '', isDone: false }]);
        }
    };

    const handleSave = () => {
        if (!title.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Title is a required field'
            });
            return;
        }

        const validSubTasks = subTasks.filter(st => st.title.trim() !== '');

        if (validSubTasks.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'At least one sub task required'
            });
            return;
        }

        const taskData = {
            title: title.trim(),
            content: content.trim(),
            priority: priority as 'Low' | 'Medium' | 'High',
            dueDate: dueDate.toISOString(),
            subTasks: validSubTasks,
        };

        createTask(taskData, {
            onSuccess: (res) => {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: res.message
                });
                setTitle('');
                setContent('');
                setPriority('Medium');
                setDueDate(new Date());
                setSubTasks([{ title: '', isDone: false }]);

                router.replace('/tasks');
            },
            onError: (err: any) => {
                Toast.show({
                    type: 'error',
                    text1: 'Create Failed',
                    text2: err.response?.data?.message || err.message
                });
            }
        });
    };

    return (
        <View className="gap-5">
            {/* Title */}
            <View className='gap-2.5'>
                <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Title <Text className='text-xs text-indigo-600'>*</Text></Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Task summary..."
                    className=" p-3.5 text-sm rounded-xl bg-back border border-gray-100 text-gray-900"
                />
            </View>
            {/* Content */}
            <View className='gap-2.5'>
                <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Content</Text>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    placeholder="More details..."
                    className="h-24 p-3.5 text-sm rounded-xl bg-back border border-gray-100 text-gray-900"
                />
            </View>
            {/* Due Date */}
            <View className='gap-2.5'>
                <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Due Date</Text>
                <TouchableOpacity
                    onPress={showDatePicker}
                    activeOpacity={0.7}
                    className="p-3.5 flex-row justify-between items-center rounded-xl bg-back border border-gray-100"
                >
                    <Text className="text-sm text-gray-400">
                        {dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
                <Modal isVisible={isDatePickerVisible} onBackdropPress={hideDatePicker}>
                    <View className="p-5 gap-2.5 bg-white rounded-2xl">
                        <Calendar
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#111827',
                                selectedDayBackgroundColor: '#4f46e5',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#4f46e5',
                                dayTextColor: '#6b7280',
                                arrowColor: '#4f46e5',
                                monthTextColor: '#111827',
                                textDayFontWeight: '500',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: 'bold',
                            }}
                            onDayPress={(day) => {
                                handleConfirm(new Date(day.dateString));
                            }}
                            markedDates={{
                                [dueDate.toISOString().split('T')[0]]: { selected: true, disableTouchEvent: true }
                            }}
                        />
                        <TouchableOpacity
                            onPress={hideDatePicker}
                            className="p-3.5 items-center bg-gray-100 rounded-xl"
                        >
                            {/* <Text className="font-bold text-gray-600">Close</Text> */}
                            <Text className="text-sm font-medium text-gray-900">Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
            {/* Priority Selector */}
            <View className='gap-2.5'>
                <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Priority</Text>
                <View className='flex-row gap-2.5'>
                    {['Low', 'Medium', 'High'].map((p) => (
                        <TouchableOpacity
                            key={p}
                            onPress={() => setPriority(p)}
                            activeOpacity={0.8}
                            style={priority === p && { backgroundColor: 'transparent', borderColor: getPriorityColor(p) }}
                            className="p-2.5 flex-1 flex-row justify-center items-center gap-2.5 bg-back rounded-xl border border-transparent"
                        >
                            <Text
                                style={priority === p && { color: getPriorityColor(p) }}
                                className='text-sm text-gray-400'
                            >
                                {p}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {/* Sub Tasks */}
            <View>
                <View className="flex-row justify-between items-center">
                    <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Sub Tasks / Steps <Text className='text-xs text-indigo-600'>*</Text></Text>
                    <TouchableOpacity onPress={addSubTask} className="p-2.5 -bg-back rounded-full">
                        <Ionicons name="add" size={25} color="#6b7280" />
                    </TouchableOpacity>
                </View>
                <View className='gap-2.5'>
                    {
                        subTasks.map((st, index) => (
                            <View key={index} className="flex-row items-center">
                                <TextInput
                                    value={st.title}
                                    onChangeText={(txt) => updateSubTask(txt, index)}
                                    onSubmitEditing={addSubTask} // Enter click
                                    placeholder={`Step ${index + 1}`}
                                    className="flex-1 p-3.5 text-sm rounded-xl bg-back border border-gray-100 text-gray-900"
                                />
                                <TouchableOpacity onPress={() => removeSubTask(index)} className="p-2.5 -bg-back rounded-full">
                                    <Ionicons name="close-circle-outline" size={25} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                </View>
            </View>
            {/* Save Button */}
            <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.8}
                className="mt-2.5 p-3.5 rounded-full flex-row justify-center items-center gap-1.5 bg-back border border-gray-500"
            >
                {
                    isPending ? (
                        <ActivityIndicator color="#4f46e5" />
                    ) : (
                        <>
                            <Ionicons name="checkmark" size={20} color="#111827" />
                            <Text className="text-sm font-medium text-gray-900">Save Task</Text>
                        </>
                    )
                }
            </TouchableOpacity>
        </View>
    );
});

export default TaskForm;