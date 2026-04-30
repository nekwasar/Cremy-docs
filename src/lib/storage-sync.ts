import { getStorageSchema, saveToStorage, clearStorage } from './storage-schema';
import { encryptStorageItem, decryptStorageItem } from './storage-encrypt';
import { migrateLocalToMongo, migrateMongoToLocal } from '@/services/data-migration';

interface SyncConfig {
  autoSync: boolean;
  syncInterval: number;
  lastSyncAt: number | null;
}

let syncConfig: SyncConfig = {
  autoSync: false,
  syncInterval: 5 * 60 * 1000,
  lastSyncAt: null,
};

export function configureSync(config: Partial<SyncConfig>): void {
  syncConfig = { ...syncConfig, ...config };
}

export async function syncLocalToCloud(userId: string): Promise<{
  success: boolean;
  documentsMigrated: number;
}> {
  const schema = getStorageSchema();
  const result = await migrateLocalToMongo(userId, {
    documents: schema.documents,
    settings: schema.settings,
    drafts: [],
  });

  if (result.success) {
    syncConfig.lastSyncAt = Date.now();
  }

  return {
    success: result.success,
    documentsMigrated: result.documentsMigrated,
  };
}

export async function syncCloudToLocal(userId: string): Promise<{
  success: boolean;
  documentsRetrieved: number;
}> {
  const data = await migrateMongoToLocal(userId);
  
  saveToStorage({
    documents: data.documents.map((d: any) => ({
      id: d.id || d._id?.toString(),
      title: d.title,
      content: d.content,
      format: d.format,
      wordCount: d.wordCount,
      status: d.status,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
  });

  return {
    success: true,
    documentsRetrieved: data.documents.length,
  };
}

export function getSyncStatus(): SyncConfig {
  return { ...syncConfig };
}

export function isSyncNeeded(): boolean {
  if (!syncConfig.autoSync || !syncConfig.lastSyncAt) return true;
  return Date.now() - syncConfig.lastSyncAt > syncConfig.syncInterval;
}
