'use client';

import { useEffect, useState } from 'react';

interface PersistedState {
  inputValue?: string;
  selectedFormat?: string;
  selectedTone?: string;
  lastUpdated?: number;
}

const STORAGE_KEY = 'cremy-persisted-state';

export function usePersistedStateRecovery() {
  const [isRecovered, setIsRecovered] = useState(false);
  const [recoveredState, setRecoveredState] = useState<PersistedState | null>(
    null
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PersistedState;
        if (parsed.lastUpdated) {
          const age = Date.now() - parsed.lastUpdated;
          if (age < 24 * 60 * 60 * 1000) {
            // Less than 24 hours
            setRecoveredState(parsed);
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
    setIsRecovered(true);
  }, []);

  const saveState = (state: PersistedState) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, lastUpdated: Date.now() })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const clearState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return { isRecovered, recoveredState, saveState, clearState };
}