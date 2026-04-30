import { create } from 'zustand';

interface ReasoningState {
  stream: string;
  isStreaming: boolean;
  append: (chunk: string) => void;
  reset: () => void;
  setStreaming: (active: boolean) => void;
}

export const useReasoningStream = create<ReasoningState>((set) => ({
  stream: '',
  isStreaming: false,
  append: (chunk) => set((s) => ({ stream: s.stream + chunk })),
  reset: () => set({ stream: '', isStreaming: false }),
  setStreaming: (active) => set({ isStreaming: active }),
}));
