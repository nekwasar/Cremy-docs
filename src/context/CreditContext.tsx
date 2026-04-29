'use client';

import { createContext } from 'react';
import { useUserStore } from '../store';

interface CreditContextValue {
  credits: number;
  deduct: (amount: number) => Promise<boolean>;
  check: (amount: number) => boolean;
  refresh: () => Promise<void>;
}

export const CreditContext = createContext<CreditContextValue | null>(null);

export function useCredits() {
  const { credits, setCredits } = useUserStore();

  const deduct = async (amount: number): Promise<boolean> => {
    const currentCredits = useUserStore.getState().credits;
    if (currentCredits >= amount) {
      setCredits(currentCredits - amount);
      return true;
    }
    return false;
  };

  const check = (amount: number): boolean => {
    return useUserStore.getState().credits >= amount;
  };

  const refresh = async (): Promise<void> => {
    try {
      const res = await fetch('/api/credits/balance');
      const data = await res.json();
      if (data.credits !== undefined) {
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  return { credits, deduct, check, refresh };
}