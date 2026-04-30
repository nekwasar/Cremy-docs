import { create } from 'zustand';

interface FormatState {
  formatId: string | null;
  inputValue: string;
  creditEstimate: number;
  isGenerating: boolean;
  generatedDocumentId: string | null;
  error: string | null;
  setFormatId: (id: string | null) => void;
  setInputValue: (value: string) => void;
  setCreditEstimate: (estimate: number) => void;
  setGenerating: (generating: boolean) => void;
  setGeneratedDocumentId: (id: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useFormatStore = create<FormatState>((set) => ({
  formatId: null,
  inputValue: '',
  creditEstimate: 0,
  isGenerating: false,
  generatedDocumentId: null,
  error: null,

  setFormatId: (id) => set({ formatId: id }),

  setInputValue: (value) =>
    set({
      inputValue: value,
      creditEstimate: Math.ceil(value.split(/\s+/).filter(Boolean).length / 100) || 0,
    }),

  setCreditEstimate: (estimate) => set({ creditEstimate: estimate }),

  setGenerating: (generating) => set({ isGenerating: generating }),

  setGeneratedDocumentId: (id) => set({ generatedDocumentId: id }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      formatId: null,
      inputValue: '',
      creditEstimate: 0,
      isGenerating: false,
      generatedDocumentId: null,
      error: null,
    }),
}));