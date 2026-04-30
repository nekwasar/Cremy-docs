'use client';

import { useEffect } from 'react';
import { useUndoStore } from '@/store/undo-store';

export function useKeyboardUndo() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isUndo =
        (e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey;

      if (isUndo) {
        e.preventDefault();
        useUndoStore.getState().undo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}