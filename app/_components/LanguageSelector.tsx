'use client';

import { Select } from './Select';

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
  languages?: { code: string; name: string }[];
}

const DEFAULT_LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' }, { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' }, { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' },
];

export function LanguageSelector({ value, onChange, languages = DEFAULT_LANGUAGES }: LanguageSelectorProps) {
  const opts = languages.map(l => ({ value: l.code, label: l.name }));
  return <Select options={opts} value={value} onChange={onChange} placeholder="Language" />;
}
