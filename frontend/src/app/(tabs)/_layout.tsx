// src/app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Button } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'; // Import icons
import useAuthStore from '../../state/authStore';

export default function TabsLayout() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // The RootLayout will automatically redirect to the login screen
  };

  return (
    <Tabs
      screenOptions={{
        // A nice blue color for the active tab, and gray for inactive
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