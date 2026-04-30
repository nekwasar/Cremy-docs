export async function handleExtract(
  content: string
): Promise<{ success: boolean; extractedText?: string; error?: string }> {
  return {
    success: true,
    extractedText: content,
  };
}
