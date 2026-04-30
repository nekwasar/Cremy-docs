import { create } from 'zustand';

interface UndoAction {
  id: string;
  elementId: string;
  before: any;
  after: any;
  timestamp: number;
  creditCost: number;
  toolType: string;
}

interface UndoState {
  history: UndoAction[];
  lastToastAction: UndoAction | null;
  toastVisible: boolean;
  toastTimer: NodeJS.Timeout | null;
  addAction: (action: Omit<UndoAction, 'id' | 'timestamp'>) => void;
  undo: () => UndoAction | null;
  canUndo: () => boolean;
  showToast: (action: UndoAction) => void;
  hideToast: () => void;
  getRefundEligible: () => UndoAction[];
  clearHistory: () => void;
}

export const useUndoStore = create<UndoState>((set, get) => ({
  history: [],
  lastToastAction: null,
  toastVisible: false,
  toastTimer: null,

  addAction: (action) => {
    const undoAction: UndoAction = {
      ...action,
      id: `undo-${Date.now()}`,
      timestamp: Date.now(),
    };

    set((state) => ({
      history: [undoAction, ...state.history].slice(0, 10),
    }));

    get().showToast(undoAction);
  },

  undo: () => {
    const { history } = get();
    if (history.length === 0) return null;

    const action = history[0];
    set((state) => ({
      history: state.history.slice(1),
      toastVisible: false,
    }));

    return action;
  },

  canUndo: () => {
    return get().history.length > 0;
  },

  showToast: (action) => {
    const { toastTimer } = get();
    if (toastTimer) clearTimeout(toastTimer);

    const timer = setTimeout(() => {
      set({ toastVisible: false, lastToastAction: null });
    }, 5000);

    set({ lastToastAction: action, toastVisible: true, toastTimer: timer });
  },

  hideToast: () => {
    const { toastTimer } = get();
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastVisible: false, lastToastAction: null });
  },

  getRefundEligible: () => {
    const now = Date.now();
    const thirtySeconds = 30 * 1000;
    return get().history.filter((a) => now - a.timestamp < thirtySeconds);
  },

  clearHistory: () => {
    set({ history: [], toastVisible: false, lastToastAction: null });
  },
}));