import { create } from 'zustand';

interface PreviewState {
  document: any | null;
  isLoading: boolean;
  currentMode: 'view' | 'edit';
  error: string | null;
  setDocument: (doc: any | null) => void;
  setLoading: (loading: boolean) => void;
  setMode: (mode: 'view' | 'edit') => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  document: null,
  isLoading: false,
  currentMode: 'view',
  error: null,
  setDocument: (doc) => set({ document: doc, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  setMode: (mode) => set({ currentMode: mode }),
  setError: (error) => set({ error }),
  reset: () => set({ document: null, isLoading: false, currentMode: 'view', error: null }),
}));