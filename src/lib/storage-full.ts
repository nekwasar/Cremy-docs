import { isStorageFull, getStorageUsage, saveToStorage, getStorageSchema } from './storage-schema';

export function handleStorageFull(): {
  isFull: boolean;
  canRecover: boolean;
  suggestedAction: string;
} {
  if (!isStorageFull()) {
    return { isFull: false, canRecover: true, suggestedAction: '' };
  }

  const usage = getStorageUsage();
  const recoverable = tryRecoverSpace();

  if (recoverable) {
    return {
      isFull: true,
      canRecover: true,
      suggestedAction: 'Old drafts have been cleaned to free up space.',
    };
  }

  return {
    isFull: true,
    canRecover: false,
    suggestedAction: `Storage is full (${(usage.used / 1024 / 1024).toFixed(1)}MB used). Upgrade to Pro for cloud storage or clear old documents in settings.`,
  };
}

function tryRecoverSpace(): boolean {
  const schema = getStorageSchema();

  const oldDrafts = schema.documents.filter(
    (d) => d.status === 'draft' && Date.now() - new Date(d.updatedAt).getTime() > 7 * 24 * 60 * 60 * 1000
  );

  if (oldDrafts.length > 0) {
    schema.documents = schema.documents.filter(
      (d) => !(d.status === 'draft' && Date.now() - new Date(d.updatedAt).getTime() > 7 * 24 * 60 * 60 * 1000)
    );
    saveToStorage(schema);
    return true;
  }

  return false;
}

export function estimateStorageNeeded(documentCount: number, averageWordCount: number): number {
  return documentCount * averageWordCount * 6;
}
