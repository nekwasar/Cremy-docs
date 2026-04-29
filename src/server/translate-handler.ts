import { generateDocument } from '@/lib/ai-generation';
import { buildTranslatePrompt } from '@/lib/prompt-builder';

interface TranslatePayload {
  text: string;
  targetLang: string;
  sourceLang?: string;
}

interface StreamHandler {
  emit(event: string, data: any): void;
}

export async function handleTranslate(
  handler: StreamHandler,
  payload: TranslatePayload
): Promise<string> {
  const prompt = buildTranslatePrompt(
    payload.text,
    payload.targetLang,
    payload.sourceLang
  );

  let translatedText = '';
  
  await generateDocument({
    prompt,
    onChunk: (chunk) => {
      translatedText += chunk;
      handler.emit('chunk', { chunk });
    },
  });

  handler.emit('complete', { translatedText });

  return translatedText;
}