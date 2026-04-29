import { generateDocument } from '@/lib/ai-generation';
import { buildFormatPrompt } from '@/lib/prompt-builder';

interface FormatPayload {
  text: string;
  formatId: string;
}

interface StreamHandler {
  emit(event: string, data: any): void;
}

export async function handleFormat(
  handler: StreamHandler,
  payload: FormatPayload
): Promise<string> {
  const prompt = buildFormatPrompt(payload.text, payload.formatId);

  let formattedText = '';
  
  await generateDocument({
    prompt,
    onChunk: (chunk) => {
      formattedText += chunk;
      handler.emit('chunk', { chunk });
    },
  });

  handler.emit('complete', { formattedText });

  return formattedText;
}