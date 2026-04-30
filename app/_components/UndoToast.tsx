'use client';

import { useUndoStore } from '@/store/undo-store';

export function UndoToast() {
  const { lastToastAction, toastVisible, undo, hideToast } = useUndoStore();

  if (!toastVisible || !lastToastAction) return null;

  const handleUndo = () => {
    undo();
    hideToast();
  };

  return (
    <div>
      <span>Change applied.</span>
      <button onClick={handleUndo} type="button">
        Undo
      </button>
      <button onClick={hideToast} type="button">
        ✕
      </button>
    </div>
  );
}