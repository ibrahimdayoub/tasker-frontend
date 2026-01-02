import { useState, useCallback } from 'react';
import { TextInput, TouchableOpacity, View, Text, Alert, ActivityIndicator, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = () => {
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onGooglePress = useCallback(async () => {
        if (!isLoaded || loading) return;

        setLoading(true);
        try {
            const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/tasks', { scheme: 'bero-tasker' })
            });

            if (createdSessionId && setOAuthActive) {
                await setOAuthActive({ session: createdSessionId });
                // router.replace('/tasks');
            }
        } catch (err: any) {
            console.error("OAuth error", err);
            Alert.alert("Error", "Could not sign in with Google. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [isLoaded, startOAuthFlow]);

    const onSignInPress = async () => {
        if (!isLoaded || loading) return;

        if (!emailAddress || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const completeSignIn = await signIn.create({ identifier: emailAddress, password });

            if (completeSignIn.status === 'complete' || completeSignIn.createdSessionId) {
                await setActive({ session: completeSignIn.createdSessionId });
                // router.replace('/tasks');
            } else {
                console.warn("Sign in status incomplete:", completeSignIn.status);
            }
        } catch (err: any) {
            const errorMsg = err.errors?.[0]?.message || "An error occurred during sign in";
            Alert.alert("Login Failed", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            {/* <SafeAreaView style={{ flex: 1, backgroundColor: '#4f46e5' }} edges={['top']}> */}
            {/* <StatusBar barStyle="light-content" backgroundColor="#4f46e5" /> */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    className="flex-1 bg-white"
                    contentContainerClassName="px-5 pt-10 gap-5"
                >
                    <View className='items-center gap-5'>
                        <Text className="text-2xl font-bold text-gray-900">Bero Tasker</Text>
                        <Text className="text-gray-500 text-center leading-6">Welcome back! Access your dashboard and stay on top of your daily goals.</Text>
                        <TouchableOpacity
                            onPress={onGooglePress}
                            disabled={loading}
                            className={`w-full mt-2.5 p-3.5 flex-row justify-center items-center gap-1.5 rounded-xl bg-back border border-gray-500 ${loading ? 'opacity-75' : ''}`}
                        >
                            <Ionicons name="logo-google" size={20} color="#ea580c" />
                            <Text className="text-sm font-medium text-gray-900">Continue with Google</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center">
                        <View className="flex-1 h-[1px] bg-back" />
                        <Text className="mx-5 text-sm font-medium text-indigo-600 uppercase">Or</Text>
                        <View className="flex-1 h-[1px] bg-back" />
                    </View>
                    <View className='gap-5'>
                        <View className='gap-2.5'>
                            <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Email <Text className='text-xs text-indigo-600'>*</Text></Text>
                            <TextInput
                                value={emailAddress}
                                onChangeText={setEmailAddress}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholder="Your email address"
                                placeholderTextColor="#6b7280"
                                style={{ textAlign: "left" }}
                                className="p-3.5 text-sm rounded-xl bg-back border border-gray-100 text-gray-900"
                            />
                        </View>
                        <View className='gap-2.5'>
                            <Text className="ms-2.5 text-xs font-medium text-gray-500 tracking-widest">Password <Text className='text-xs text-indigo-600'>*</Text></Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                placeholder="Your password"
                                placeholderTextColor="#6b7280"
                                style={{ textAlign: "left" }}
                                className="p-3.5 text-sm rounded-xl bg-back border border-gray-100 text-gray-900"
                            />
                        </View>
                        <TouchableOpacity
                            disabled={loading}
                            onPress={onSignInPress}
                            className={`w-full p-3.5 flex-row justify-center items-center gap-1.5 rounded-xl bg-indigo-600 border border-indigo-600 ${loading ? 'opacity-75' : ''}`}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="font-medium text-white">Sign In</Text>
                            )}
                        </TouchableOpacity>
                        <View className="flex-row justify-center">
                            <Text className="text-sm font-medium text-gray-500">New here? </Text>
                            <Link href="/(auth)/sign-up">
                                <Text className="text-sm font-medium text-indigo-600 underline">Create Account</Text>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}

export default SignInScreen;