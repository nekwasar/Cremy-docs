import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'free' | 'pro' | 'admin';
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  credits: number;
  setUser: (user: User | null) => void;
  setCredits: (credits: number) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      credits: 0,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          credits: user?.credits || 0,
        }),
      setCredits: (credits) => set({ credits }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          credits: 0,
        }),
    }),
    {
      name: 'cremy-user',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        credits: state.credits,
      }),
    }
  )
);