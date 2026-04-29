interface TimeoutOptions {
  timeoutMs: number;
  onTimeout: () => void;
}

export function createTimeout(
  options: TimeoutOptions
): { clear: () => void } {
  const timeoutId = setTimeout(() => {
    options.onTimeout();
  }, options.timeoutMs);

  return {
    clear: () => clearTimeout(timeoutId),
  };
}

export const DEFAULT_TIMEOUT_MS = 60000;

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Generation timeout')), timeoutMs)
    ),
  ]);
}