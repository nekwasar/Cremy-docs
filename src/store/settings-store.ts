import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  defaultTone: 'professional' | 'casual' | 'formal';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: string) => void;
  setDefaultTone: (tone: 'professional' | 'casual' | 'formal') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      defaultTone: 'professional',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setDefaultTone: (defaultTone) => set({ defaultTone }),
    }),
    {
      name: 'cremy-settings',
    }
  )
);