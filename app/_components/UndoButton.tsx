'use client';

import { useUndoStore } from '@/store/undo-store';

export function UndoButton() {
  const canUndo = useUndoStore((s) => s.history.length > 0);
  const undo = useUndoStore((s) => s.undo);

  return (
    <button onClick={() => undo()} disabled={!canUndo} type="button">
      Undo
    </button>
  );
}