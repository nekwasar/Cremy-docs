import { create } from 'zustand';

interface GenerateState {
  inputValue: string;
  originalInput: string;
  selectedStructure: string;
  selectedTemplate: string | null;
  images: File[];
  isGenerating: boolean;
  creditEstimate: number;
  generatedDocumentId: string | null;
  isStreaming: boolean;
  streamedContent: string;
  setInputValue: (value: string) => void;
  setStructure: (structure: string) => void;
  setTemplate: (templateId: string | null) => void;
  addImage: (image: File) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
  clearInput: () => void;
  setGenerating: (generating: boolean) => void;
  setCreditEstimate: (estimate: number) => void;
  setGeneratedDocumentId: (id: string | null) => void;
  setStreaming: (streaming: boolean) => void;
  appendStreamContent: (chunk: string) => void;
  resetStreamContent: () => void;
  preserveInputForRegeneration: () => void;
}

export const useGenerateStore = create<GenerateState>((set) => ({
  inputValue: '',
  originalInput: '',
  selectedStructure: 'auto',
  selectedTemplate: null,
  images: [],
  isGenerating: false,
  creditEstimate: 0,
  generatedDocumentId: null,
  isStreaming: false,
  streamedContent: '',

  setInputValue: (value) =>
    set({
      inputValue: value,
      creditEstimate: Math.ceil(value.split(/\s+/).filter(Boolean).length / 100) || 0,
    }),

  setStructure: (structure) => set({ selectedStructure: structure }),

  setTemplate: (templateId) => set({ selectedTemplate: templateId }),

  addImage: (image) =>
    set((state) => ({
      images: state.images.length < 5 ? [...state.images, image] : state.images,
      creditEstimate: state.creditEstimate + 1,
    })),

  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
      creditEstimate: Math.max(0, state.creditEstimate - 1),
    })),

  clearImages: () =>
    set((state) => ({
      images: [],
      creditEstimate: Math.max(0, state.creditEstimate - state.images.length),
    })),

  clearInput: () =>
    set({
      inputValue: '',
      images: [],
      creditEstimate: 0,
      selectedStructure: 'auto',
      selectedTemplate: null,
    }),

  setGenerating: (generating) => set({ isGenerating: generating }),

  setCreditEstimate: (estimate) => set({ creditEstimate: estimate }),

  setGeneratedDocumentId: (id) => set({ generatedDocumentId: id }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  appendStreamContent: (chunk) =>
    set((state) => ({ streamedContent: state.streamedContent + chunk })),

  resetStreamContent: () => set({ streamedContent: '' }),

  preserveInputForRegeneration: () =>
    set((state) => ({ originalInput: state.inputValue })),
}));