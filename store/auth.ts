import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
    if (user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      AsyncStorage.removeItem('user');
    }
  },
  setLoading: (isLoading) => set({ isLoading }),
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        set({ user, isAuthenticated: true });
      }
    } catch (e) {
      // ignore error
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    AsyncStorage.removeItem('user');
  },
}));

export default useAuthStore;
