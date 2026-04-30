import { generateDocument } from '@/lib/ai-generation';
import { formatTranscript } from '@/lib/transcript-formatter';

export async function handleChangeStyle(
  content: string,
  style: string
): Promise<{ success: boolean; original?: string; styled?: string; error?: string }> {
  try {
    let result = '';
    await generateDocument({
      prompt: `Reformat the following content in "${style}" style while preserving all content:\n\n${content}`,
      onChunk: (chunk) => { result += chunk; },
    });

    return {
      success: true,
      original: content.slice(0, 500),
      styled: result.slice(0, 500),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
