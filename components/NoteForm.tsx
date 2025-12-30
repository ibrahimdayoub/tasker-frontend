import React, { memo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotesApi } from '@/api/noteApi';
import { NOTESCOLORS } from '@/utils/helpers';

const NoteForm = memo(() => {
    const router = useRouter();

    const { useCreateNote } = useNotesApi();
    const { mutate: createNote, isPending } = useCreateNote();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedColor, setSelectedColor] = useState(NOTESCOLORS[NOTESCOLORS.length - 1]);
    const [isPinned, setIsPinned] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
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

        if (tags.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'At least one tag required'
            });
            return;
        }

        const noteData = {
            title: title.trim(),
            content: content.trim(),
            color: selectedColor,
            isPinned,
            tags,
        };

        createNote(noteData, {
            onSuccess: (res) => {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: res.message
                });
                setTitle('');
                setContent('');
                setSelectedColor(NOTESCOLORS[0]);
                setIsPinned(false);
                setTags([]);

                router.replace('/notes');
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
                    placeholder="Note summary..."
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
            {/* Pin Switch */}
            <View className="p-2.5 flex-row justify-between items-center bg-back rounded-xl">
                <View className="flex-row items-center">
                    <Ionicons name={isPinned ? "pin" : "pin-outline"} size={25} color={isPinned ? "#4f46e5" : "#6b7280"} />
                    <Text className="text-xs font-medium text-gray-500 tracking-widest">Pin to top</Text>
                </View>
                <Switch
                    value={isPinned}
                    onValueChange={setIsPinned}
                    trackColor={{ true: '#4f46e5', false: '#6b7280' }}
                    thumbColor="#fff"
                />
            </View>
            {/* Color */}
            <View className='gap-2.5'>
                <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Color</Text>
                <View className="flex-row gap-2.5">
                    {
                        NOTESCOLORS?.map((color) => (
                            <TouchableOpacity
                                key={color}
                                onPress={() => setSelectedColor(color)}
                                style={selectedColor === color ? { backgroundColor: color } : { backgroundColor: color + '25' }}
                                className='w-10 h-10 rounded-full'
                            />
                        ))
                    }
                </View>
            </View>
            {/* Tags */}
            <View className='gap-2.5'>
                <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Tags <Text className='text-xs text-indigo-600'>*</Text></Text>
                <View className="flex-row items-center">
                    <TextInput
                        value={tagInput}
                        onChangeText={setTagInput}
                        onSubmitEditing={addTag} // Enter click
                        placeholder="E.g. Work, Ideas"
                        className="flex-1 p-3.5 text-sm rounded-xl bg-back border border-gray-100 text-gray-900"
                    />
                    <TouchableOpacity onPress={addTag} className="p-2.5 -bg-back rounded-full">
                        <Ionicons name="add" size={25} color="#6b7280" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-1.5">
                    {
                        tags.map((t) => (
                            <TouchableOpacity
                                key={t}
                                onPress={() => removeTag(t)}
                                className="px-2.5 py-1 flex-row items-center gap-2.5 bg-back rounded-full border border-gray-100"
                            >
                                <Text className="text-xs font-medium text-indigo-600 uppercase"># {t}</Text>
                                <Ionicons name="close-circle" size={20} color="#4f46e5" />
                            </TouchableOpacity>
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
                            <Text className="text-sm font-medium text-gray-900">Save Note</Text>
                        </>
                    )
                }
            </TouchableOpacity>
        </View>
    );
});

export default NoteForm;