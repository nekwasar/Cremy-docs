import { generateDocument } from '@/lib/ai-generation';
import { buildTranslatePrompt } from '@/lib/prompt-builder';

export async function handleTranslate(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<{ success: boolean; translatedText?: string; originalText?: string; error?: string }> {
  try {
    const prompt = buildTranslatePrompt(text, targetLang, sourceLang);
    let result = '';

    await generateDocument({
      prompt,
      onChunk: (chunk) => { result += chunk; },
    });

    return {
      success: true,
      translatedText: result,
      originalText: text,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
