export async function createConversionTimeout(
  timeoutMs: number = 60000
): Promise<{ promise: Promise<void>; cleanup: () => void }> {
  let timeoutId: NodeJS.Timeout;

  const promise = new Promise<void>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Conversion timed out')), timeoutMs);
  });

  return {
    promise,
    cleanup: () => clearTimeout(timeoutId!),
  };
}
