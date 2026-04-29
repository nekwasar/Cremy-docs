'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUserStore } from '@/store/user-store';
import { useDocumentStore } from '@/store/document-store';
import { useUIStore } from '@/store/ui-store';
import { useSettingsStore } from '@/store/settings-store';

const StoreContext = createContext<null>(null);

export function useStores() {
  return useContext(StoreContext);
}

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return <StoreContext.Provider value={null}>{children}</StoreContext.Provider>;
}