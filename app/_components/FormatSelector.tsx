'use client';

import { Select } from './Select';

const OPTS = [
  { value: 'auto', label: 'Auto' },
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'Plain Text' },
];

interface FormatSelectorProps {
  selected?: string;
  onChange?: (formatId: string) => void;
}

export function FormatSelector({ selected = 'auto', onChange }: FormatSelectorProps) {
  return <Select options={OPTS} value={selected} onChange={(v) => onChange?.(v)} placeholder="Format" />;
}
