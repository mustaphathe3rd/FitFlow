import React, { useState, useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import useAuthStore from '../state/authStore';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { isAuthenticated, login } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  // Effect 1: Check for a stored token only once on app startup.
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          login(storedToken);
        }
      } catch (e) {
        // Handle error, e.g., log it
        console.error("Failed to load token from storage", e);
      } finally {
        // Signal that the app is ready to render.
        setAppIsReady(true);
      }
    };

    checkToken();
  }, []); // The empty dependency array ensures this runs only once.

  // Effect 2: Handle redirection based on authentication state.
  // This effect runs whenever isAuthenticated or appIsReady changes.
  useEffect(() => {
    // Don't run until the initial token check is complete.
    if (!appIsReady) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // User is authenticated but is in the auth screen group.
      // Redirect to the main app (e.g., home screen).
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and is not in the auth screen group.
      // Redirect to the login screen.
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, appIsReady, segments]);

  // Show a loading screen or spinner while we check for the token.
  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Once the app is ready, render the active route.
  return <Slot />;
}