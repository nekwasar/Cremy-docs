export async function convertWithFallback(
  convertFn: () => Promise<Blob>,
  fallbackFn: () => Promise<Blob>
): Promise<{ blob: Blob; usedFallback: boolean }> {
  try {
    const blob = await convertFn();
    return { blob, usedFallback: false };
  } catch {
    try {
      const blob = await fallbackFn();
      return { blob, usedFallback: true };
    } catch (error) {
      throw new Error('Both primary and fallback conversion failed');
    }
  }
}
