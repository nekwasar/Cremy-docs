'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useUserStore } from '@/store/user-store';

interface CreditContextType {
  credits: number;
  isLoading: boolean;
  fetchCredits: () => Promise<void>;
  deductCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<boolean>;
  hasEnoughCredits: (amount: number) => boolean;
}

const CreditContext = createContext<CreditContextType | null>(null);

export function useCredit() {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredit must be used within CreditProvider');
  }
  return context;
}

interface CreditProviderProps {
  children: ReactNode;
}

export function CreditProvider({ children }: CreditProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { credits, setCredits, fetchUser } = useUserStore();

  const fetchCredits = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/credits/balance');
      const data = await response.json();
      if (data.success) {
        setCredits(data.data.credits);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [setCredits]);

  const deductCredits = useCallback(async (amount: number): Promise<boolean> => {
    if (!hasEnoughCredits(amount)) {
      return false;
    }

    try {
      const newCredits = credits - amount;
      setCredits(newCredits);
      return true;
    } catch {
      return false;
    }
  }, [credits, setCredits]);

  const addCredits = useCallback(async (amount: number): Promise<boolean> => {
    try {
      const newCredits = credits + amount;
      setCredits(newCredits);
      return true;
    } catch {
      return false;
    }
  }, [credits, setCredits]);

  const hasEnoughCredits = useCallback((amount: number): boolean => {
    return credits >= amount;
  }, [credits]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return (
    <CreditContext.Provider
      value={{
        credits,
        isLoading,
        fetchCredits,
        deductCredits,
        addCredits,
        hasEnoughCredits,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
}