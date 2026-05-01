import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'free' | 'pro' | 'admin';
  credits: number;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  credits: number;
  isAnonymous: boolean;
  setUser: (user: User | null) => void;
  setCredits: (credits: number) => void;
  deductCredits: (amount: number) => boolean;
  logout: () => void;
  fetchUser: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      credits: 0,
      isAnonymous: true,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          credits: user?.credits || 0,
          isAnonymous: !user,
        }),
      setCredits: (credits) => set({ credits }),
      deductCredits: (amount) => {
        const current = get().credits;
        if (current >= amount) {
          set({ credits: current - amount });
          return true;
        }
        return false;
      },
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          credits: 0,
          isAnonymous: true,
        }),
      fetchUser: () => {},
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
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