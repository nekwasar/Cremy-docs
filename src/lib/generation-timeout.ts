const DEFAULT_TIMEOUT_MS = 60000;
const PARTIAL_SAVE_THRESHOLD = 50;

interface TimeoutResult {
  timedOut: boolean;
  partialContent: string | null;
  percentComplete: number;
  canContinue: boolean;
}

export function createGenerationTimeout(
  onTimeout: () => void,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): { clear: () => void } {
  const timeoutId = setTimeout(onTimeout, timeoutMs);
  return { clear: () => clearTimeout(timeoutId) };
}

export async function withGenerationTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<{ result?: T; timeoutResult?: TimeoutResult }> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<{ timeoutResult: TimeoutResult }>((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({
        timeoutResult: {
          timedOut: true,
          partialContent: null,
          percentComplete: 0,
          canContinue: true,
        },
      });
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch {
    clearTimeout(timeoutId!);
    throw new Error('Generation failed');
  }
}

export function shouldPartialSave(percentComplete: number): boolean {
  return percentComplete > PARTIAL_SAVE_THRESHOLD;
}

export function getTimeoutConfig(): { timeoutMs: number; partialSaveThreshold: number } {
  return {
    timeoutMs: DEFAULT_TIMEOUT_MS,
    partialSaveThreshold: PARTIAL_SAVE_THRESHOLD,
  };
}