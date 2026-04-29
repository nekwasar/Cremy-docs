'use client';

import { useCallback } from 'react';

interface InputSendOptions {
  onSend: (value: string) => void;
  validator?: (value: string) => boolean;
  disabled?: boolean;
}

export function useInputSend({
  onSend,
  validator,
  disabled = false,
}: InputSendOptions) {
  const handleSend = useCallback(
    (value: string) => {
      if (disabled) return;
      if (validator && !validator(value)) return;
      onSend(value);
    },
    [onSend, validator, disabled]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, value: string) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(value);
      }
    },
    [handleSend]
  );

  return { handleSend, handleKeyDown };
}