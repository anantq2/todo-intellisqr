import { create } from 'zustand';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  restoreSession: (user: User, token: string) => void;
}

// Helper: LocalStorage se user nikalne ke liye (Safe parsing)
const getUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem('taskflow_user'); 
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  // 1. Initialization: Token ke saath User bhi load karo
  user: getUserFromStorage(),
  token: localStorage.getItem(STORAGE_KEYS.TOKEN),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  
  login: (user, token) => {
    // 2. Login: Token aur User dono save karo
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    // 3. Logout: Dono remove karo
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem('taskflow_user');
    
    set({ user: null, token: null, isAuthenticated: false });
  },

  restoreSession: (user, token) => {
    set({ user, token, isAuthenticated: true });
  }
}));