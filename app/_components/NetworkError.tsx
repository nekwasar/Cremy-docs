'use client';

import { ReactNode, useState } from 'react';

interface NetworkErrorProps {
  onRetry?: () => void;
  maxRetries?: number;
}

export function NetworkError({
  onRetry,
  maxRetries = 3,
}: NetworkErrorProps): ReactNode {
  const [retries, setRetries] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (retries >= maxRetries) return;
    setIsRetrying(true);
    setRetries(retries + 1);
    try {
      await onRetry?.();
    } finally {
      setIsRetrying(false);
    }
  };

  if (retries >= maxRetries) {
    return (
      <div>
        <p>Connection failed. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <p>Connection lost. Reconnecting... ({retries}/{maxRetries})</p>
      <button
       
        onClick={handleRetry}
        disabled={isRetrying}
      >
        {isRetrying ? 'Retrying...' : 'Retry Now'}
      </button>
    </div>
  );
}