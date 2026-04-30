'use client';

interface ErrorDisplayProps {
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorDisplay({ message, code, onRetry, onDismiss }: ErrorDisplayProps) {
  return (
    <div data-error={code || 'unknown'}>
      <p>{message}</p>
      {code && <small>Error code: {code}</small>}
      <div>
        {onRetry && <button onClick={onRetry} type="button">Try Again</button>}
        {onDismiss && <button onClick={onDismiss} type="button">Dismiss</button>}
      </div>
    </div>
  );
}