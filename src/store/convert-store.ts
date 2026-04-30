import { create } from 'zustand';

interface ConvertState {
  sourceFile: File | null;
  sourceFormat: string;
  targetFormat: string;
  isConverting: boolean;
  convertedBlob: Blob | null;
  convertedId: string | null;
  progress: number;
  error: string | null;
  qualityMessage: string | null;
  setSourceFile: (file: File | null) => void;
  setSourceFormat: (format: string) => void;
  setTargetFormat: (format: string) => void;
  setConverting: (converting: boolean) => void;
  setConvertedBlob: (blob: Blob | null) => void;
  setConvertedId: (id: string | null) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setQualityMessage: (msg: string | null) => void;
  reset: () => void;
}

export const useConvertStore = create<ConvertState>((set) => ({
  sourceFile: null,
  sourceFormat: '',
  targetFormat: 'pdf',
  isConverting: false,
  convertedBlob: null,
  convertedId: null,
  progress: 0,
  error: null,
  qualityMessage: null,

  setSourceFile: (file) => set({ sourceFile: file, error: null }),
  setSourceFormat: (format) => set({ sourceFormat: format }),
  setTargetFormat: (format) => set({ targetFormat: format }),
  setConverting: (converting) => set({ isConverting: converting }),
  setConvertedBlob: (blob) => set({ convertedBlob: blob }),
  setConvertedId: (id) => set({ convertedId: id }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  setQualityMessage: (msg) => set({ qualityMessage: msg }),

  reset: () =>
    set({
      sourceFile: null,
      sourceFormat: '',
      targetFormat: 'pdf',
      isConverting: false,
      convertedBlob: null,
      convertedId: null,
      progress: 0,
      error: null,
      qualityMessage: null,
    }),
}));