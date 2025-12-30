import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorProps {
    text?: string
    error: any;
    refetch: () => void
}

const Error = ({ text = "Something Went Wrong", error, refetch }: ErrorProps) => {
    const errorMessage = error?.message || (typeof error === 'string' ? error : "Unable to connect to the server");

    return (
        <View className='px-5 py-10 flex-1 justify-center items-center gap-2.5'>
            <Ionicons name="alert-circle-outline" size={50} color="#ef4444" />
            <View className="gap-1.5">
                <Text className="font-medium text-gray-900 text-center">{text}</Text>
                <Text className="text-sm font-light text-gray-500 text-center">
                    {errorMessage}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => refetch()}
                className="mt-2.5 px-5 py-1.5 bg-gray-100 rounded-full border border-gray-500"
            >
                <Text className="text-sm text-gray-500">Try Again</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Error;