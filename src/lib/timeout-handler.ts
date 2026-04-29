const DEFAULT_TIMEOUT_MS = 60000;

interface TimeoutHandler {
  timeoutId: NodeJS.Timeout | null;
  onTimeout: () => void;
}

export function createTimeoutHandler(
  onTimeout: () => void,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): { start: () => void; clear: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;

  const start = () => {
    clear();
    timeoutId = setTimeout(() => {
      onTimeout();
    }, timeoutMs);
  };

  const clear = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { start, clear };
}

export function getTimeoutDuration(): number {
  return DEFAULT_TIMEOUT_MS;
}