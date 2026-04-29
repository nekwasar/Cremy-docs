import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIState {
  isLoading: boolean;
  activeModal: string | null;
  toasts: Toast[];
  setLoading: (status: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isLoading: false,
  activeModal: null,
  toasts: [],
  setLoading: (status) => set({ isLoading: status }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast-${Date.now()}` },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));