import { create } from 'zustand';

interface DocumentPreview {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
}

interface DocumentState {
  currentDocument: DocumentPreview | null;
  documentHistory: DocumentPreview[];
  isGenerating: boolean;
  streamingContent: string;
  setCurrentDocument: (doc: DocumentPreview | null) => void;
  addToHistory: (doc: DocumentPreview) => void;
  setGenerating: (status: boolean) => void;
  setStreamingContent: (content: string) => void;
  clearDocument: () => void;
}

export const useDocumentStore = create<DocumentState>()((set) => ({
  currentDocument: null,
  documentHistory: [],
  isGenerating: false,
  streamingContent: '',
  setCurrentDocument: (doc) => set({ currentDocument: doc }),
  addToHistory: (doc) =>
    set((state) => ({
      documentHistory: [doc, ...state.documentHistory].slice(0, 50),
    })),
  setGenerating: (status) => set({ isGenerating: status }),
  setStreamingContent: (content) => set({ streamingContent: content }),
  clearDocument: () =>
    set({
      currentDocument: null,
      streamingContent: '',
      isGenerating: false,
    }),
}));