
import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Note } from '@/types/note';
import { useNotesApi } from '@/api/noteApi';

interface NoteCardProps {
    note: Note
}

const MenuOption = ({ icon, text, onPress, color = "#6b7280", latestOption }: any) => (
    <TouchableOpacity onPress={onPress} className={`flex-row items-center p-2.5 gap-1.5 border-b ${latestOption ? "border-transparent" : "border-gray-100"}`}>
        {
            (text === "Pin" || text === "Unpin") ?
                <MaterialCommunityIcons name={icon} size={17.5} color={color} /> :
                <Ionicons name={icon} size={15} color={color} />
        }
        {
            text &&
            <Text style={{ color }} className="text-xs">{text}</Text>
        }

    </TouchableOpacity>
);

const NoteCard = ({ note }: NoteCardProps) => {
    const swipeableRef = useRef<any>(null);

    const { useToggleArchive, useTogglePin, useDuplicateNote, useDeleteNote } = useNotesApi();

    const { mutate: toggleArchive } = useToggleArchive();
    const { mutate: togglePin } = useTogglePin();
    const { mutate: duplicateNote } = useDuplicateNote();
    const { mutate: deleteNote } = useDeleteNote();

    const [menuVisible, setMenuVisible] = useState(false);

    const handleArchive = () => {
        toggleArchive(note._id, {
            // onSuccess: (res) => {
            //     Toast.show({
            //         type: 'success',
            //         text1: 'Success',
            //         text2: res.message
            //     });
            // },
            onError: (err) => {
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                    text2: err.message
                });
            }
        });
    };

    const handlePin = () => {
        togglePin(note._id, {
            // onSuccess: (res) => {
            //     Toast.show({
            //         type: 'success',
            //         text1: 'Success',
            //         text2: res.message
            //     });
            // },
            onError: (err) => {
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                    text2: err.message
                });
            }
        });
    };

    const handleDuplicate = () => {
        Alert.alert(
            "Duplicate Note",
            "Are you sure you want to create a copy of this note?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Ok",
                    onPress: () => {
                        duplicateNote(note._id, {
                            // onSuccess: (res) => {
                            //     Toast.show({
                            //         type: 'success',
                            //         text1: 'Success',
                            //         text2: res.message
                            //     });
                            // },
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
        Alert.alert(
            "Delete Note",
            "This action cannot be undone. Proceed?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Ok",
                    onPress: () => {
                        deleteNote(note._id, {
                            // onSuccess: (res) => {
                            //     Toast.show({
                            //         type: 'success',
                            //         text1: 'Success',
                            //         text2: res.message
                            //     });
                            // },
                            onError: (err) => {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Update Failed xxx',
                                    text2: err.message
                                });
                            }
                        });
                    }
                }
            ]
        );
    };

    const renderLeftActions = (prog: any, drag: any) => {
        const animatedIconStyle = useAnimatedStyle(() => {
            const scale = interpolate(
                prog.value,
                [0, 1],
                [0.25, 1.25]
            );

            return {
                transform: [{ scale }]
            };
        });

        return (
            <View className="w-20 justify-center items-center bg-indigo-600 rounded-l-xl">
                <Animated.View style={animatedIconStyle} className=" justify-center items-center">
                    <Ionicons name="copy-outline" size={20} color="white" />
                    <Text className="text-[10px] text-white text-center">Copy</Text>
                </Animated.View>
            </View>
        );
    };

    const renderRightActions = (prog: any, drag: any) => {
        const animatedIconStyle = useAnimatedStyle(() => {
            const scale = interpolate(
                prog.value,
                [0, 1],
                [0.25, 1.25]
            );

            return {
                transform: [{ scale }]
            };
        });

        return (
            <View className="w-20 justify-center items-center bg-red-500 rounded-r-xl">
                <Animated.View style={animatedIconStyle} className=" justify-center items-center">
                    <Ionicons name="trash-outline" size={20} color="white" />
                    <Text className="text-[10px] text-white text-center">Delete</Text>
                </Animated.View>
            </View>
        );
    };

    return (
        <ReanimatedSwipeable
            ref={swipeableRef}
            enableTrackpadTwoFingerGesture
            leftThreshold={50}
            rightThreshold={50}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            friction={2}
            overshootFriction={8}
            onSwipeableOpen={(direction) => {
                if (direction === 'left') {
                    handleDelete();
                } else {
                    handleDuplicate();
                }
                swipeableRef.current?.close();
            }}
        >
            <View className='bg-white rounded-xl overflow-hidden'>
                <View
                    style={{ backgroundColor: note.color + '15' }}
                    className="p-5 gap-2.5 rounded-xl relative"
                >
                    <View className="flex-row justify-between items-start gap-1.5">
                        <Text className="flex-1 text-base font-medium text-gray-900">
                            {note.title}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setMenuVisible(!menuVisible)}
                            className="p-2.5 bg-white rounded-full shadow-sm z-30"
                        >
                            <Ionicons
                                name={menuVisible ? "close" : "ellipsis-vertical"}
                                size={15}
                                color={menuVisible ? "#4f46e5" : "#6b7280"}
                            />
                        </TouchableOpacity>
                        {
                            menuVisible && (
                                <View className="absolute right-12 top-0 ps-1.5 pe-2.5 py-1 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                                    <MenuOption
                                        icon={note.isPinned ? "pin-off-outline" : "pin-outline"}
                                        text={note.isPinned ? "Unpin" : "Pin"}
                                        onPress={() => { handlePin(); setMenuVisible(false); }}
                                    />
                                    <MenuOption
                                        icon={note.isArchived ? "refresh" : "archive-outline"}
                                        text={note.isArchived ? "Unarchive" : "Archive"}
                                        onPress={() => { handleArchive(); setMenuVisible(false); }}
                                        latestOption={true}
                                    />
                                </View>
                            )
                        }
                    </View>
                    {
                        note.content &&
                        <Text className="text-sm text-gray-500">{note.content}</Text>
                    }
                    <View className="flex-row justify-between items-end gap-1.5">
                        <View className="flex-1 flex-row flex-wrap gap-1">
                            {
                                note.tags.map((tag: string) => (
                                    <View key={tag} className="px-2.5 py-1 bg-white rounded-full border border-gray-100">
                                        <Text className="text-[8px] font-medium text-indigo-600 uppercase"># {tag}</Text>
                                    </View>
                                ))
                            }
                        </View>
                        {
                            note.isPinned &&
                            <MaterialCommunityIcons name="pin" size={15} color="#4f46e5" />
                        }
                    </View>
                </View>
            </View>
        </ReanimatedSwipeable>
    );
};

export default NoteCard;