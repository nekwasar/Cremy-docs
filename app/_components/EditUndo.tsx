'use client';

import { useEffect, useState } from 'react';
import { useUndoStore } from '@/store/undo-store';

export function EditUndo() {
  const [showUndo, setShowUndo] = useState(false);
  const [lastActionId, setLastActionId] = useState<string | null>(null);

  const history = useUndoStore((s) => s.history);
  const undo = useUndoStore((s) => s.undo);

  useEffect(() => {
    if (history.length > 0 && history[0].id !== lastActionId) {
      setLastActionId(history[0].id);
      setShowUndo(true);

      const timer = setTimeout(() => {
        setShowUndo(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [history, lastActionId]);

  if (!showUndo) return null;

  const lastAction = history[0];
  const now = Date.now();
  const withinThirtySeconds = lastAction && (now - lastAction.timestamp) < 30000;

  return (
    <div>
      <span>Edit applied</span>
      <button onClick={() => { undo(); setShowUndo(false); }} type="button">Undo</button>
      {withinThirtySeconds && <span>Credit refund available</span>}
      <button onClick={() => setShowUndo(false)} type="button">✕</button>
    </div>
  );
}