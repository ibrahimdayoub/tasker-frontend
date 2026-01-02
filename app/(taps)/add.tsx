import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, UIManager, StatusBar, Animated } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';
import NoteForm from '@/components/NoteForm';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AddScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [activeTab, setActiveTab] = useState<'Task' | 'Note'>('Task');

  const toggleTab = (tab: 'Task' | 'Note') => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });

    setActiveTab(tab);
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
          contentContainerStyle={{ paddingBottom: 100 }}
          contentContainerClassName="px-5 pt-7 gap-10"
        >
          {/* Header */}
          <Header
            title={activeTab === 'Task' ? 'Create Task' : 'Create Note'}
            subtitle={activeTab === 'Task' ? 'Plan your milestone' : 'Capture your thoughts'}
            iconName={activeTab === 'Task' ? "flash" : "bulb"}
          />
          {/* Tabs */}
          <View className='p-1.5 flex-row bg-back rounded-full'>
            {['Task', 'Note'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => toggleTab(tab as any)}
                activeOpacity={0.8}
                style={{ backgroundColor: activeTab === tab ? '#4f46e5' : '#f4f7fa' }}
                className='px-5 py-2.5 flex-1 flex-row justify-center items-center gap-1.5 rounded-full'
              >
                <Ionicons
                  name={tab === 'Task' ? "list-outline" : "document-text-outline"}
                  size={20}
                  color={activeTab === tab ? '#fff' : '#4f46e5'}
                />
                <Text
                  style={{ color: activeTab === tab ? '#fff' : '#4f46e5' }}
                  className='text-sm tracking-widest'
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Content */}
          <Animated.View style={{ opacity: fadeAnim }}>
            {activeTab === 'Task' ? <TaskForm /> : <NoteForm />}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AddScreen;