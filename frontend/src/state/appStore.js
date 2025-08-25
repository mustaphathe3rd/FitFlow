// src/state/appStore.js
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import Purchases from 'react-native-purchases';
import api from '../services/api';

const useAppStore = create((set) => ({
  // Auth State
  token: null,
  isAuthenticated: false,
  // App State
  offerings: null,
  isDeveloperMode: true, // Enable our workaround by default
  hasPremiumAccess: false,
  detectedEquipment: [],
  workoutPlan: null,

  // --- ACTIONS ---

  setWorkoutPlan: (plan) => set({ workoutPlan: plan }),
  clearWorkoutPlan: () => set({ workoutPlan: null }),
  grantPremiumAccess: () => set({ hasPremiumAccess: true }),
  revokePremiumAccess: () => set({ hasPremiumAccess: false }),
  setDetectedEquipment: (equipment) => set({ detectedEquipment: equipment }),
  clearDetectedEquipment: () => set({ detectedEquipment: [] }),

  login: async (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await SecureStore.setItemAsync('userToken', token);
    set({ token, isAuthenticated: true });

    try {
      // We use a slice of the token as a stable, unique ID for this example
      await Purchases.logIn(token.slice(-20)); 
      console.log("✅ RevenueCat user identified");
    } catch (e) {
      console.warn("RevenueCat login failed", e);
    }
  },
  
  logout: async () => {
    delete api.defaults.headers.common['Authorization'];
    await SecureStore.deleteItemAsync('userToken');
    await Purchases.logOut();
    // Reset all state on logout
    set({ token: null, isAuthenticated: false, offerings: null, hasPremiumAccess: false, workoutPlan: null });
    console.log("👋 RevenueCat user logged out");
  },
  
  fetchOfferings: async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
        console.log("✅ Successfully fetched offerings:", offerings.current);
        set({ offerings: offerings.current, isDeveloperMode: false });
      } else {
        console.log("ℹ️ No offerings found. Staying in Developer Mode.");
      }
    } catch (e) {
      console.error("😿 Error fetching offerings:", e);
      console.log("ℹ️ Fetch failed. Staying in Developer Mode.");
    }
  },

  // --- START: NEW FUNCTION ---
  checkEntitlements: async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
        set({ hasPremiumAccess: true });
      } else {
        set({ hasPremiumAccess: false });
      }
    } catch (e) {
      console.error("Error checking entitlements", e);
      set({ hasPremiumAccess: false });
    }
  },
  // --- END: NEW FUNCTION ---
}));

export default useAppStore;