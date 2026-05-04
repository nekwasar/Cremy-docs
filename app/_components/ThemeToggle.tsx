'use client';

import { Select } from './Select';

const OPTS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const handleChange = (v: string) => {
    const t = v as Theme;
    localStorage.setItem('theme', t);
    document.documentElement.setAttribute('data-theme', t === 'system' ? 'light' : t);
  };

  return <Select options={OPTS} value="" onChange={handleChange} placeholder="Theme" />;
}
