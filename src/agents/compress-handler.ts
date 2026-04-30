export async function handleCompress(
  originalSize: number,
  compressionLevel: string = 'medium'
): Promise<{ success: boolean; originalSize: number; compressedSize: number; error?: string }> {
  const ratios: Record<string, number> = { low: 0.3, medium: 0.5, high: 0.7 };
  const ratio = ratios[compressionLevel] || 0.5;
  const compressedSize = Math.round(originalSize * (1 - ratio));

  return {
    success: true,
    originalSize,
    compressedSize,
  };
}
