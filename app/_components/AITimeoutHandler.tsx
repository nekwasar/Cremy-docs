'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';

interface AITimeoutProps {
  onTimeout?: () => void;
  onRetry?: () => void;
  timeoutMs?: number;
}

export function AITimeoutHandler({
  onTimeout,
  onRetry,
  timeoutMs = 60000,
}: AITimeoutProps): ReactNode {
  const [isTimedOut, setIsTimedOut] = useState(false);

  const handleTimeout = useCallback(() => {
    setIsTimedOut(true);
    onTimeout?.();
  }, [onTimeout]);

  useEffect(() => {
    const timer = setTimeout(handleTimeout, timeoutMs);
    return () => clearTimeout(timer);
  }, [handleTimeout, timeoutMs]);

  if (isTimedOut) {
    return (
      <div className="ai-timeout">
        <p>Generation timed out. Your input has been preserved.</p>
        <button className="retry-button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  return null;
}