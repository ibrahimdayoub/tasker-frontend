import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingProps {
    text?: string
}

const Loading = ({ text = "Loading..." }: LoadingProps) => {
    return (
        <View className='px-5 py-10 flex-1 justify-center items-center gap-2.5'>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="font-light text-gray-500 text-center">{text}</Text>
        </View>
    )
}

export default Loading;