'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useUserStore } from '@/store/user-store';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const { updateUser } = useSettingsStore?.() || {};

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme === 'system' ? 'light' : newTheme);
  };

  return (
    <select value={theme} onChange={(e) => handleThemeChange(e.target.value as Theme)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

function useSettingsStore() {
  return useUserStore;
}