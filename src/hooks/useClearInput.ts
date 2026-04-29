'use client';

import { useCallback, useRef, useState } from 'react';

interface UseClearInputReturn {
  clear: () => void;
  isCleared: boolean;
  clearRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function useClearInput(initialValue = ''): UseClearInputReturn {
  const [value, setValue] = useState(initialValue);
  const [isCleared, setIsCleared] = useState(false);
  const clearRef = useRef<HTMLTextAreaElement | null>(null);

  const clear = useCallback(() => {
    setValue('');
    setIsCleared(true);

    if (clearRef.current) {
      clearRef.current.value = '';
    }

    setTimeout(() => setIsCleared(false), 200);
  }, []);

  return {
    clear,
    isCleared,
    clearRef,
  };
}