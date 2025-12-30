import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  href?: string;
  isLoading?: boolean;
  onPress?: () => void;
}

const Header = ({
  title,
  subtitle,
  iconName = 'home',
  href,
  onPress,
  isLoading
}: HeaderProps) => {

  const HeaderButton = (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
      className={`p-3.5 bg-gray-50 rounded-full border border-gray-100 ${isLoading ? 'opacity-75' : ''}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
      }}
    >
      {
        isLoading ? (
          <ActivityIndicator size="small" color="#4f46e5" />
        ) : (
          <Ionicons name={iconName} size={20} color="#4f46e5" />
        )
      }
    </TouchableOpacity>
  );

  return (
    <View className="px-1.5 flex-row justify-between items-center">
      <View>
        <Text className="text-sm text-gray-500 uppercase tracking-widest">{subtitle}</Text>
        <Text className="text-2xl font-bold text-gray-900">{title}</Text>
      </View>
      {
        href && !isLoading ? (
          <Link href={href as any} asChild>
            {HeaderButton}
          </Link>
        ) : (
          HeaderButton
        )
      }
    </View>
  );
};

export default Header;