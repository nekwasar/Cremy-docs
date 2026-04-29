'use client';

import { ReactNode, useState } from 'react';

interface FormatOption {
  id: string;
  name: string;
}

interface FormatSelectorProps {
  selected?: string;
  onChange?: (formatId: string) => void;
}

const formats: FormatOption[] = [
  { id: 'auto', name: 'Auto' },
  { id: 'pdf', name: 'PDF' },
  { id: 'docx', name: 'DOCX' },
  { id: 'txt', name: 'Plain Text' },
];

export function FormatSelector({
  selected = 'auto',
  onChange,
}: FormatSelectorProps): ReactNode {
  const [value, setValue] = useState(selected);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="format-selector">
      <label htmlFor="format-select">Format</label>
      <select
        id="format-select"
        value={value}
        onChange={handleChange}
        className="format-select"
      >
        {formats.map((fmt) => (
          <option key={fmt.id} value={fmt.id}>
            {fmt.name}
          </option>
        ))}
      </select>
    </div>
  );
}