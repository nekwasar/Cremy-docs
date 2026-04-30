'use client';

import { useEffect } from 'react';
import { useUndoStore } from '@/store/undo-store';
import { getEditCreditsUsed } from '@/lib/edit-credit';

interface EditFeedbackProps {
  elementId: string;
  creditsUsed?: number;
  onDismiss: () => void;
}

export function EditFeedback({ elementId, creditsUsed, onDismiss }: EditFeedbackProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const userId = 'current';

  return (
    <div data-edit-feedback="true">
      <span>Edit applied to element {elementId}</span>
      {creditsUsed !== undefined && creditsUsed > 0 && (
        <span>{creditsUsed} credit{creditsUsed !== 1 ? 's' : ''} used</span>
      )}
      <span>{getEditCreditsUsed(userId)} total credits used for edits</span>
      <button onClick={onDismiss} type="button">✕</button>
    </div>
  );
}