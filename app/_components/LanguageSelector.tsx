'use client';

import { ReactNode, useState } from 'react';

interface LanguageOption {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  selected?: string;
  onChange?: (langCode: string) => void;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

export function LanguageSelector({
  selected = 'en',
  onChange,
}: LanguageSelectorProps): ReactNode {
  const [value, setValue] = useState(selected);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select">Language</label>
      <select
        id="language-select"
        value={value}
        onChange={handleChange}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}