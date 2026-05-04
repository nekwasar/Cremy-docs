'use client';

import { Select } from './Select';

type Tone = 'professional' | 'casual' | 'formal';

interface ToneSelectorProps {
  selected?: Tone;
  onChange?: (tone: Tone) => void;
}

const OPTS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
];

export function ToneSelector({ selected = 'professional', onChange }: ToneSelectorProps) {
  return <Select options={OPTS} value={selected} onChange={(v) => onChange?.(v as Tone)} placeholder="Tone" />;
}
