import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface InnerHeaderProps {
    title: string;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightPress?: () => void;
    showRightIcon?: boolean;
}

const InnerHeader = ({
    title,
    rightIcon = 'home',
    onRightPress,
    showRightIcon = true
}: InnerHeaderProps) => {
    const router = useRouter();

    return (
        <View className="pb-5 flex-row justify-between items-center border-b border-back">
            <View className="flex-row items-center gap-5">
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                    className="p-3.5 rounded-full bg-gray-50 border border-gray-100"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        elevation: 2
                    }}
                >
                    <Ionicons name="chevron-back" size={20} color="#111827" />
                </TouchableOpacity>
                <Text className="text-xl font-medium text-gray-900">{title}</Text>
            </View>
            {
                showRightIcon && (
                    <TouchableOpacity
                        onPress={onRightPress}
                        disabled={!onRightPress}
                        activeOpacity={0.8}
                        className={`p-3.5 rounded-full bg-gray-50 border border-gray-100`}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 2
                        }}
                    >
                        <Ionicons
                            name={rightIcon}
                            size={20}
                            color="#4f46e5"
                        />
                    </TouchableOpacity>
                )
            }
        </View>
    );
};

export default InnerHeader;