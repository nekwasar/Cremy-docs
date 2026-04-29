'use client';

import { ReactNode } from 'react';

interface InlineErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function InlineError({ message, onDismiss }: InlineErrorProps): ReactNode | null {
  if (!message) return null;

  return (
    <div className="inline-error">
      <span className="error-message">{message}</span>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss}>
         Dismiss
        </button>
      )}
    </div>
  );
}