'use client';

import { useState } from 'react';

interface AIEditInputProps {
  onSubmit: (instruction: string, targetElementId?: string) => void;
  isLoading: boolean;
  targetElementId?: string;
  placeholder?: string;
}

export function AIEditInput({
  onSubmit,
  isLoading,
  targetElementId,
  placeholder = 'Tell AI how to edit... (e.g. "make this more confident")',
}: AIEditInputProps) {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = () => {
    if (!instruction.trim() || isLoading) return;
    onSubmit(instruction.trim(), targetElementId);
    setInstruction('');
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <button onClick={handleSubmit} disabled={isLoading || !instruction.trim()}>
          {isLoading ? 'Editing...' : 'Send'}
        </button>
      </div>
      <div>
        <small>1 credit per 10 prompts</small>
      </div>
    </div>
  );
}