import { create } from 'zustand';

interface DocumentPreview {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
}

interface DocumentState {
  currentDocument: DocumentPreview | null;
  document: any | null;
  loading: boolean;
  documentHistory: DocumentPreview[];
  isGenerating: boolean;
  streamingContent: string;
  setCurrentDocument: (doc: DocumentPreview | null) => void;
  addToHistory: (doc: DocumentPreview) => void;
  setGenerating: (status: boolean) => void;
  setStreamingContent: (content: string) => void;
  clearDocument: () => void;
  fetchDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>()((set) => ({
  currentDocument: null,
  document: null,
  loading: false,
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
      document: null,
      streamingContent: '',
      isGenerating: false,
    }),
  fetchDocument: async (id: string) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/documents/${id}`);
      const data = await response.json();
      if (data.success) {
        set({ document: data.data.document, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));