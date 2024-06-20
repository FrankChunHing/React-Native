import { Tabs } from 'expo-router';
import React from 'react';
// import Login from './login.js';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      {/* <Tabs.Screen
        name="login"
        initialParams={{ defaultTab: 'login' }}
        options={{
          title: 'LOGIN',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'key' : 'key-outline'} color={color} />
          ),
        }}
      />         */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tradeNavigator"
        options={{
          title: 'CRYPTO',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="finance" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quizGame"
        options={{
          title: 'QUIZ',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
    
  );
}
