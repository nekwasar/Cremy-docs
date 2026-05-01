import { create } from 'zustand';

interface DashboardDocument {
  id: string;
  title: string;
  content: string;
  format: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  folderId?: string;
}

interface DashboardFolder {
  id: string;
  name: string;
  documentCount: number;
  createdAt: string;
}

interface DashboardState {
  documents: DashboardDocument[];
  folders: DashboardFolder[];
  selectedDocument: DashboardDocument | null;
  selectedFolder: string | null;
  isLoading: boolean;
  searchQuery: string;
  sortBy: string;
  filterFormat: string;
  activityLoggingEnabled: boolean;
  analyticsData: {
    documentsThisMonth: number;
    creditsUsedThisMonth: number;
    mostUsedFormats: Array<{ format: string; count: number }>;
    activityTimeline: Array<{ action: string; timestamp: string; details: string }>;
  };
  setDocuments: (docs: DashboardDocument[]) => void;
  setFolders: (folders: DashboardFolder[]) => void;
  setSelectedDocument: (doc: DashboardDocument | null) => void;
  setSelectedFolder: (folderId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  setFilterFormat: (format: string) => void;
  setActivityLogging: (enabled: boolean) => void;
  setAnalyticsData: (data: Partial<DashboardState['analyticsData']>) => void;
  removeDocument: (id: string) => void;
  addFolder: (folder: DashboardFolder) => void;
  removeFolder: (id: string) => void;
  moveDocument: (docId: string, folderId: string | null) => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  documents: [],
  folders: [],
  selectedDocument: null,
  selectedFolder: null,
  isLoading: false,
  searchQuery: '',
  sortBy: 'newest',
  filterFormat: '',
  activityLoggingEnabled: true,
  analyticsData: {
    documentsThisMonth: 0,
    creditsUsedThisMonth: 0,
    mostUsedFormats: [],
    activityTimeline: [],
  },

  setDocuments: (docs) => set({ documents: docs }),
  setFolders: (folders) => set({ folders }),
  setSelectedDocument: (doc) => set({ selectedDocument: doc }),
  setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),
  setFilterFormat: (filterFormat) => set({ filterFormat }),
  setActivityLogging: (enabled) => {
    localStorage.setItem('activity_logging', String(enabled));
    set({ activityLoggingEnabled: enabled });
  },
  setAnalyticsData: (data) =>
    set((state) => ({ analyticsData: { ...state.analyticsData, ...data } })),
  removeDocument: (id) =>
    set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),
  addFolder: (folder) =>
    set((state) => ({ folders: [...state.folders, folder] })),
  removeFolder: (id) =>
    set((state) => ({ folders: state.folders.filter((f) => f.id !== id) })),
  moveDocument: (docId, folderId) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === docId ? { ...d, folderId: folderId || undefined } : d
      ),
    })),
  reset: () =>
    set({
      documents: [],
      folders: [],
      selectedDocument: null,
      selectedFolder: null,
      isLoading: false,
      searchQuery: '',
      sortBy: 'newest',
      filterFormat: '',
    }),
}));