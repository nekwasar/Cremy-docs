import { generateDocument } from '@/lib/ai-generation';
import { buildEditPrompt } from '@/lib/prompt-builder';

export async function handleEdit(
  documentContent: string,
  instruction: string
): Promise<{ success: boolean; original?: string; edited?: string; error?: string }> {
  try {
    const prompt = buildEditPrompt(documentContent, instruction);
    let result = '';

    await generateDocument({
      prompt,
      onChunk: (chunk) => { result += chunk; },
    });

    return {
      success: true,
      original: documentContent.slice(0, 500),
      edited: result.slice(0, 500),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
