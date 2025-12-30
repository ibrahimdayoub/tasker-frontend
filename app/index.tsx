import { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';

const IndexScreen = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace('/tasks');
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || isSignedIn) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4f46e5' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <View
        className="px-5 pt-10 flex-1 justify-center items-center gap-5 bg-white">
        <View className="w-24 h-24 items-center justify-center bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-200">
          <Text className="text-4xl font-bold text-white italic">BT</Text>
        </View>
        <View className="items-center gap-1.5">
          <Text className="text-3xl font-extrabold text-gray-900">
            Bero Tasker
          </Text>
          <View className="w-12 h-1 bg-indigo-600 rounded-full" />
        </View>
        <Text className="text-gray-500 text-center leading-6">
          Organize your daily tasks and notes with style and ease.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/sign-in')}
          activeOpacity={0.8}
          className="w-full mt-5 p-3.5 flex-row justify-center items-center gap-1.5 rounded-xl bg-indigo-600 border border-indigo-600"
        >
          <Text className="font-medium text-white">
            Start Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default IndexScreen;