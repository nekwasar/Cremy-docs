import { getMongoDb } from '@/lib/mongodb';
import type { Document } from '@/types/document';

interface PartialSaveResult {
  saved: boolean;
  canContinue: boolean;
  documentId?: string;
  percentComplete: number;
}

export async function savePartialDocument(
  userId: string,
  document: Document,
  percentComplete: number
): Promise<PartialSaveResult> {
  const shouldSave = percentComplete > 50;

  if (!shouldSave) {
    return { saved: false, canContinue: false, percentComplete };
  }

  try {
    const db = await getMongoDb();
    
    const partialDoc = {
      ...document,
      userId,
      status: 'partial',
      percentComplete,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('documents').insertOne(partialDoc);

    return {
      saved: true,
      canContinue: true,
      documentId: result.insertedId.toString(),
      percentComplete,
    };
  } catch {
    return { saved: false, canContinue: false, percentComplete };
  }
}

export async function loadPartialDocument(
  documentId: string,
  userId: string
): Promise<Document | null> {
  const db = await getMongoDb();
  
  const document = await db.collection('documents').findOne({
    _id: documentId as any,
    userId,
    status: 'partial',
  });

  return document as Document | null;
}