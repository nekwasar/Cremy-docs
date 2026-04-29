import { getMongoDb } from '@/lib/mongodb';
import { generateDocument } from '@/lib/ai-generation';
import { buildGeneratePrompt } from '@/lib/prompt-builder';
import { countWords } from '@/lib/word-count';
import { validateInput } from '@/lib/input-validation';
import { saveDocument } from '@/lib/document-save';
import { calculateCreditCost } from '@/lib/credit-cost';
import type { Document } from '@/types/document';
import { GenerationError, GenerationErrorCode } from './errors';

interface GeneratePayload {
  text: string;
  formatId?: string;
  tone?: string;
  templateId?: string;
}

interface StreamHandler {
  emit(event: string, data: any): void;
  userId: string;
}

let activeGeneration: Map<string, { signal: AbortSignal; cancel: () => void }> = new Map();

export async function handleGenerate(
  handler: StreamHandler,
  payload: GeneratePayload
): Promise<Document> {
  const validation = validateInput(payload.text);
  if (!validation.valid) {
    throw new GenerationError(GenerationErrorCode.INVALID_INPUT, validation.errors.join(', '));
  }

  const db = await getMongoDb();
  const user = await db.collection('users').findOne({ _id: handler.userId });
  
  if (!user || user.credits < 1) {
    throw new GenerationError(GenerationErrorCode.INSUFFICIENT_CREDITS, 'Insufficient credits');
  }

  await db.collection('users').updateOne(
    { _id: handler.userId },
    { $inc: { credits: -1 } }
  );

  const template = payload.templateId
    ? await db.collection('templates').findOne({ _id: payload.templateId })
    : null;

  const prompt = buildGeneratePrompt({
    text: payload.text,
    template: template as any,
    tone: payload.tone,
    format: payload.formatId,
  });

  const doc = await generateDocument({
    prompt,
    onChunk: (chunk) => {
      if (activeGeneration.has(handler.userId)) {
        handler.emit('chunk', { chunk });
      }
    },
  });

  doc.userId = handler.userId;
  const wordCount = countWords(doc.content);
  const cost = calculateCreditCost(wordCount, !!template);

  const savedId = await saveDocument(handler.userId, doc, payload.templateId);
  doc.id = savedId;

  handler.emit('credit_update', { credits: user.credits - 1 });

  return doc;
}

export function cancelGeneration(userId: string): boolean {
  const generation = activeGeneration.get(userId);
  if (generation) {
    generation.cancel();
    activeGeneration.delete(userId);
    return true;
  }
  return false;
}