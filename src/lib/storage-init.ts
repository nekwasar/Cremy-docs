import { getStorageSchema, saveToStorage, isStorageFull } from './storage-schema';
import { v4 as uuidv4 } from 'uuid';

export function initializeStorage(userId?: string): { initialized: boolean; anonId?: string } {
  if (isStorageFull()) {
    return { initialized: false };
  }

  let anonId: string | undefined;

  const schema = getStorageSchema();
  if (!schema.userId) {
    anonId = uuidv4();
    saveToStorage({
      userId: anonId,
      isAnonymous: !userId,
      createdAt: Date.now(),
    });
  }

  return { initialized: true, anonId: anonId || schema.userId };
}

export function initializeUserStorage(userId: string): void {
  const schema = getStorageSchema();

  if (schema.isAnonymous && schema.userId !== userId) {
    const anonDocuments = schema.documents;
    clearAnonAndInitUser(userId, anonDocuments);
  } else {
    saveToStorage({ userId, isAnonymous: false });
  }
}

function clearAnonAndInitUser(userId: string, anonDocs: any[]): void {
  saveToStorage({
    userId,
    isAnonymous: false,
    documents: anonDocs,
    createdAt: Date.now(),
  });
}

export function getStorageInfo(): {
  initialized: boolean;
  isAnonymous: boolean;
  documentCount: number;
  usedBytes: number;
} {
  const schema = getStorageSchema();
  const used = 0;
  return {
    initialized: !!schema.userId,
    isAnonymous: schema.isAnonymous,
    documentCount: schema.documents.length,
    usedBytes: used,
  };
}
