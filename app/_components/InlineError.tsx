'use client';

import { ReactNode } from 'react';

interface InlineErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function InlineError({ message, onDismiss }: InlineErrorProps): ReactNode | null {
  if (!message) return null;

  return (
    <div>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss}>
         Dismiss
        </button>
      )}
    </div>
  );
}