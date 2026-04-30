import { create } from 'zustand';
import { StorageService } from '@/services/storage';

interface StorageState {
  initialized: boolean;
  isAnonymous: boolean;
  isSyncing: boolean;
  isFull: boolean;
  documentCount: number;
  lastSyncAt: number | null;
  init: (userId?: string) => void;
  initUser: (userId: string) => void;
  syncToCloud: (userId: string) => Promise<void>;
  syncFromCloud: (userId: string) => Promise<void>;
  refresh: () => void;
}

export const useStorageStore = create<StorageState>((set) => ({
  initialized: false,
  isAnonymous: true,
  isSyncing: false,
  isFull: false,
  documentCount: 0,
  lastSyncAt: null,

  init: (userId) => {
    const result = StorageService.init(userId);
    set({
      initialized: result.initialized,
      isAnonymous: !userId,
    });
  },

  initUser: (userId) => {
    StorageService.initUser(userId);
    set({ isAnonymous: false });
  },

  syncToCloud: async (userId) => {
    set({ isSyncing: true });
    const result = await StorageService.syncToCloud(userId);
    set({
      isSyncing: false,
      lastSyncAt: result.success ? Date.now() : null,
    });
  },

  syncFromCloud: async (userId) => {
    set({ isSyncing: true });
    await StorageService.syncFromCloud(userId);
    set({ isSyncing: false, lastSyncAt: Date.now() });
  },

  refresh: () => {
    const docs = StorageService.getDocuments();
    set({ documentCount: docs.length });
  },
}));