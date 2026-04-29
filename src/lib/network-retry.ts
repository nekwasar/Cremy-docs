interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

interface RetryableFunction<T> {
  (): Promise<T>;
}

export async function retryRequest<T>(
  fn: RetryableFunction<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < options.maxRetries) {
        const delay = Math.min(
          options.baseDelay * Math.pow(2, attempt - 1),
          options.maxDelay
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export function createNetworkRetry(
  onReconnecting: () => void,
  onFailed: () => void
) {
  let retryCount = 0;
  const maxRetries = 3;

  const handleRetry = async (): Promise<boolean> => {
    if (retryCount >= maxRetries) {
      onFailed();
      return false;
    }

    retryCount++;
    onReconnecting();
    
    const delay = Math.pow(2, retryCount) * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    return true;
  };

  const reset = () => {
    retryCount = 0;
  };

  return { handleRetry, reset };
}