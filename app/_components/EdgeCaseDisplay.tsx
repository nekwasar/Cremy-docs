'use client';

interface EdgeCaseDisplayProps {
  type: string;
  title: string;
  message: string;
  suggestions?: string[];
  onRetry?: () => void;
  onDismiss?: () => void;
  onAction?: (action: string) => void;
  actionLabel?: string;
}

export function EdgeCaseDisplay({
  type,
  title,
  message,
  suggestions,
  onRetry,
  onDismiss,
  onAction,
  actionLabel,
}: EdgeCaseDisplayProps) {
  return (
    <div data-edge-case={type}>
      <h3>{title}</h3>
      <p>{message}</p>

      {suggestions && suggestions.length > 0 && (
        <div>
          <h4>Suggestions</h4>
          <ul>
            {suggestions.map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        {onRetry && (
          <button onClick={onRetry} type="button">
            Try Again
          </button>
        )}
        {onAction && actionLabel && (
          <button onClick={() => onAction(actionLabel)} type="button">
            {actionLabel}
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} type="button">
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}