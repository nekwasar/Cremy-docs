'use client';

import { ExpandableTextarea } from './ExpandableTextarea';
import { CharacterCounter } from './CharacterCounter';

interface GenerateInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function GenerateInputBox({ value, onChange, disabled = false }: GenerateInputBoxProps) {
  return (
    <div>
      <ExpandableTextarea
        value={value}
        onChange={onChange}
        placeholder="Describe what document you want to create..."
        minRows={2}
        maxRows={6}
        maxHeight={300}
        disabled={disabled}
      />
      <CharacterCounter text={value} />
    </div>
  );
}