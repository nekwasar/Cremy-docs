'use client';

import { createContext } from 'react';
import { useUserStore } from '../store';

interface AuthContextValue {
  user: ReturnType<typeof useUserStore>['user'];
  isAuthenticated: boolean;
  credits: number;
  login: (userData: { id: string; email: string; name: string; credits: number; role: 'free' | 'pro' | 'admin' }) => void;
  logout: () => void;
  updateCredits: (credits: number) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const { user, isAuthenticated, setUser, setCredits, logout } = useUserStore();

  const login = (userData: { id: string; email: string; name: string; credits: number; role: 'free' | 'pro' | 'admin' }) => {
    setUser({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    });
    setCredits(userData.credits);
  };

  const updateCredits = (credits: number) => {
    setCredits(credits);
  };

  return {
    user,
    isAuthenticated,
    credits: useUserStore.getState().credits,
    login,
    logout,
    updateCredits,
  };
}