interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

interface RetryableFunction<T> {
  (): Promise<T>;
}

export async function retry<T>(
  fn: RetryableFunction<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error | null = null;
  let delay = options.delayMs;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < options.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= options.backoffMultiplier;
      }
    }
  }

  throw lastError;
}