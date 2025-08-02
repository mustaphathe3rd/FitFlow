import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const useAuthStore = create((set) => ({
  token: null,
  isAuthenticated: false,
  login: async (token) => {
    // Set token for future API requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await SecureStore.setItemAsync('userToken', token);
    set({ token, isAuthenticated: true });
  },
  logout: async () => {
    delete api.defaults.headers.common['Authorization'];
    await SecureStore.deleteItemAsync('userToken');
    set({ token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;