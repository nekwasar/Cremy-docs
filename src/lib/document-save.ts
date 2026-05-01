import { getMongoDb } from '@/lib/mongodb';
import type { Document } from '@/types/document';
import { countWords } from './word-count';

export async function saveDocument(
  userId: string,
  document: Document,
  templateId?: string
): Promise<string> {
  const db = await getMongoDb();

  const wordCount = countWords(document.content);

  const docToSave = {
    ...document,
    userId,
    templateId,
    metadata: {
      ...document.metadata,
      wordCount,
      createdAt: new Date(),
    },
    status: document.status || 'complete',
    versions: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('documents').insertOne(docToSave);

  return result.insertedId.toString();
}

export async function loadDocument(
  documentId: string,
  userId: string
): Promise<Document | null> {
  const db = await getMongoDb();

  const document = await db.collection('documents').findOne({
    _id: documentId as any,
    userId,
  });

  if (!document) {
    return null;
  }

  return document as unknown as Document;
}

export async function listDocuments(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ documents: Document[]; total: number }> {
  const db = await getMongoDb();

  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    db.collection('documents')
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('documents').countDocuments({ userId }),
  ]);

  return { documents: documents as unknown as Document[], total };
}

export async function deleteDocument(
  documentId: string,
  userId: string
): Promise<boolean> {
  const db = await getMongoDb();

  const result = await db.collection('documents').deleteOne({
    _id: documentId as any,
    userId,
  });

  return result.deletedCount > 0;
}