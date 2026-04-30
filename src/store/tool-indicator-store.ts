import { create } from 'zustand';

type ToolType = 'generate' | 'edit' | 'convert' | 'translate' | 'voice' | 'extract' | 'merge' | 'split' | 'compress' | 'change-style';
type ToolStatus = 'idle' | 'processing' | 'complete';

interface ToolIndicatorState {
  activeTool: ToolType | null;
  toolStatus: Record<string, ToolStatus>;
  setActiveTool: (tool: ToolType | null) => void;
  setToolStatus: (tool: ToolType, status: ToolStatus) => void;
  reset: () => void;
}

export const useToolIndicatorStore = create<ToolIndicatorState>((set) => ({
  activeTool: null,
  toolStatus: {},
  setActiveTool: (tool) => set({ activeTool: tool }),
  setToolStatus: (tool, status) =>
    set((state) => ({
      toolStatus: { ...state.toolStatus, [tool]: status },
    })),
  reset: () => set({ activeTool: null, toolStatus: {} }),
}));