import { getMongoDb } from '@/lib/mongodb';
import type { Document } from '@/types/document';

interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  content: string;
  title: string;
  wordCount: number;
  createdAt: Date;
}

export async function saveVersion(document: Document): Promise<number> {
  const db = await getMongoDb();
  
  const versionData = {
    documentId: document.id,
    userId: document.userId,
    versionNumber: document.versions || 1,
    content: document.content,
    title: document.title,
    wordCount: document.metadata.wordCount,
    createdAt: new Date(),
  };

  await db.collection('document_versions').insertOne(versionData);
  
  await db.collection('documents').updateOne(
    { _id: document.id },
    { $inc: { versions: 1 }, $set: { updatedAt: new Date() } }
  );

  return (document.versions || 1) + 1;
}

export async function getVersions(
  documentId: string,
  userId: string
): Promise<DocumentVersion[]> {
  const db = await getMongoDb();
  
  return db.collection('document_versions')
    .find({ documentId, userId })
    .sort({ versionNumber: -1 })
    .toArray() as Promise<DocumentVersion[]>;
}

export async function getVersionById(versionId: string): Promise<DocumentVersion | null> {
  const db = await getMongoDb();
  
  return db.collection('document_versions').findOne({ _id: versionId }) as Promise<DocumentVersion | null>;
}

export async function restoreVersion(
  documentId: string,
  versionId: string,
  userId: string
): Promise<Document | null> {
  const db = await getMongoDb();
  
  const version = await getVersionById(versionId);
  if (!version) return null;

  const document = await db.collection('documents').findOne({
    _id: documentId,
    userId,
  });

  if (!document) return null;

  const updatedDocument = {
    ...document,
    content: version.content,
    title: version.title,
    metadata: {
      ...document.metadata,
      wordCount: version.wordCount,
    },
    updatedAt: new Date(),
  };

  await db.collection('documents').updateOne(
    { _id: documentId },
    { $set: updatedDocument }
  );

  await saveVersion(updatedDocument as Document);

  return updatedDocument as Document;
}