// src/app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Button } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import useAppStore from '../../state/appStore';

export default function TabsLayout() {
  const { logout } = useAppStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007BFF', 
        headerRight: () => <Button onPress={handleLogout} title="Log Out" />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="weight-lifter" size={24} color={color} />,
        }}
      />
      {/* --- START: NEW PAYWALL SCREEN --- */}
      <Tabs.Screen
        name="paywall"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color }) => <FontAwesome5 name="star" size={24} color={color} />,
        }}
      />
      {/* --- END: NEW PAYWALL SCREEN --- */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}