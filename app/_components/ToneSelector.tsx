'use client';

import { ReactNode, useState } from 'react';

type Tone = 'professional' | 'casual' | 'formal';

interface ToneSelectorProps {
  selected?: Tone;
  onChange?: (tone: Tone) => void;
}

const tones: { id: Tone; label: string }[] = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'formal', label: 'Formal' },
];

export function ToneSelector({
  selected = 'professional',
  onChange,
}: ToneSelectorProps): ReactNode {
  const [value, setValue] = useState(selected);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as Tone;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div>
      <label htmlFor="tone-select">Tone</label>
      <select
        id="tone-select"
        value={value}
        onChange={handleChange}
       
      >
        {tones.map((tone) => (
          <option key={tone.id} value={tone.id}>
            {tone.label}
          </option>
        ))}
      </select>
    </div>
  );
}