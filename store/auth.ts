import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const USER_STORAGE_KEY = 'go-chat-user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // To check if we are still loading user from storage
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
    if (user) {
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
  },
  checkAuth: async () => {
    try {
      const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load user from storage', e);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    AsyncStorage.removeItem(USER_STORAGE_KEY);
  },
}));