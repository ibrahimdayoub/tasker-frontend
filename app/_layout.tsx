import 'react-native-gesture-handler';
import "expo-standard-web-crypto";
import "../global.css";
import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast } from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

const queryClient = new QueryClient();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4f46e5', height: 75, borderLeftWidth: 2.5, backgroundColor: '#fff' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}
      text2Style={{ fontSize: 12, color: '#6b7280' }}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#ef4444', height: 75, borderLeftWidth: 2.5, backgroundColor: '#fff' }}
      text1Style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}
      text2Style={{ fontSize: 12, color: '#6b7280' }}
    />
  )
};

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthGroup && segments[0] !== undefined) {
      router.replace('/');
    } else if (isSignedIn && (inAuthGroup || segments[0] === undefined)) {
      router.replace('/tasks');
    }
  }, [isSignedIn, isLoaded, segments]);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
};

const RootLayout = () => {
  if (!publishableKey) {
    console.error("Clerk Publishable Key is missing!");
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <InitialLayout />
            <Toast config={toastConfig} />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  wrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#111827',
  }
});

export default RootLayout;