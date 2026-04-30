import { convertWithAI } from '@/lib/ai-conversion';

export async function handleConvert(
  file: File,
  targetFormat: string
): Promise<{ success: boolean; documentId?: string; before?: string; after?: string; error?: string }> {
  try {
    const blob = await convertWithAI(file, targetFormat);
    const afterText = await blob.text();
    const beforeText = await file.text();

    return {
      success: true,
      before: beforeText.slice(0, 1000),
      after: afterText.slice(0, 1000),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
