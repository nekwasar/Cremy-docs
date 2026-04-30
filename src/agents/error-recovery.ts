export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<{ result?: T; error?: string; attempts: number; bestResult?: T }> {
  let lastError: string = '';
  const results: T[] = [];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await fn();
      results.push(result);

      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (error: any) {
      lastError = error.message;

      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  if (results.length > 0) {
    return {
      result: results[results.length - 1],
      bestResult: results.length > 1 ? results[0] : undefined,
      attempts: maxRetries,
    };
  }

  return {
    error: lastError || 'All attempts failed',
    attempts: maxRetries,
  };
}

export function getRecoveryMessage(toolId: string, attempts: number): string {
  if (attempts >= 3) {
    return `The ${toolId} operation failed after ${attempts} attempts. Please try again with different input or contact support.`;
  }
  if (attempts >= 2) {
    return `Still trying... Attempt ${attempts + 1}.`;
  }
  return `Retrying... First attempt had an issue.`;
}
