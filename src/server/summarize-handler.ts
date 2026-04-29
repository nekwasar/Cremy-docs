import { generateDocument } from '@/lib/ai-generation';
import { buildSummarizePrompt } from '@/lib/prompt-builder';

interface SummarizePayload {
  text: string;
}

interface StreamHandler {
  emit(event: string, data: any): void;
}

export async function handleSummarize(
  handler: StreamHandler,
  payload: SummarizePayload
): Promise<string> {
  const prompt = buildSummarizePrompt(payload.text);

  let summary = '';
  
  await generateDocument({
    prompt,
    onChunk: (chunk) => {
      summary += chunk;
      handler.emit('chunk', { chunk });
    },
  });

  handler.emit('complete', { summary });

  return summary;
}