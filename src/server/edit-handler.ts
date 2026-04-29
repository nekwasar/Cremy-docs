import { generateDocument } from '@/lib/ai-generation';
import { buildEditPrompt } from '@/lib/prompt-builder';
import { saveDocument } from '@/lib/document-save';
import { loadDocument } from '@/lib/document-save';
import type { Document } from '@/types/document';
import { GenerationError, GenerationErrorCode } from './errors';

interface EditPayload {
  documentId: string;
  instruction: string;
}

interface StreamHandler {
  emit(event: string, data: any): void;
  userId: string;
}

export async function handleEdit(
  handler: StreamHandler,
  payload: EditPayload
): Promise<Document> {
  const doc = await loadDocument(payload.documentId, handler.userId);
  
  if (!doc) {
    throw new GenerationError(GenerationErrorCode.NOT_FOUND, 'Document not found');
  }

  const prompt = buildEditPrompt(doc.content, payload.instruction);

  const updatedDoc = await generateDocument({
    prompt,
    onChunk: (chunk) => {
      handler.emit('chunk', { chunk });
    },
  });

  updatedDoc.id = payload.documentId;
  updatedDoc.userId = handler.userId;
  updatedDoc.versions = (doc.versions || 1) + 1;

  await saveDocument(handler.userId, updatedDoc);

  return updatedDoc;
}