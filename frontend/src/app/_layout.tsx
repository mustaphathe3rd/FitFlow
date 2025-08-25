import React, { useState, useEffect } from 'react';
import { useRouter, useSegments, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Purchases from 'react-native-purchases';
import { View, ActivityIndicator, AppState } from 'react-native'; // <-- Added AppState here
import useAppStore from '../state/appStore';

const REVENUECAT_API_KEY = 'goog_FKUnahQvekHZqGpUfXZdbeyXlLo'; // Your key

export default function RootLayoutNav() {
  const { isAuthenticated, login } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  // Effect 1: Initialize app - Check for stored token and configure RevenueCat
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
        console.log("✅ RevenueCat SDK configured!");
      } catch (e) {
        console.error("RevenueCat SDK configuration error:", e);
      }

      // Check for stored authentication token
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          await login(storedToken);
          // Also check entitlements on initial load
          await useAppStore.getState().checkEntitlements();
          useAppStore.getState().fetchOfferings();
        }
      } catch (e) {
        console.error("Failed to load token from storage", e);
      } finally {
        setAppIsReady(true);
      }
    };

    initializeApp();
  }, []);

  // Effect 2: Handle redirection based on authentication state.
  useEffect(() => {
    if (!appIsReady) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, appIsReady, segments]);
  
  // --- START: NEWLY ADDED EFFECT FROM DAY 15 ---
  // Effect 3: Set up a listener for app state changes (e.g., coming to foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        // Re-check entitlements and fetch offerings when app becomes active
        await useAppStore.getState().checkEntitlements();
        await useAppStore.getState().fetchOfferings();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  // --- END: NEWLY ADDED EFFECT ---

  // Show a loading screen while the app initializes.
  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Once the app is ready, render the Stack Navigator.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)/workout-summary" options={{ presentation: 'modal', title: 'Workout Plan' }} />
      <Stack.Screen name="(modals)/scanner" options={{ presentation: 'modal', title: 'Equipment Scanner' }} />
    </Stack>
  );
}