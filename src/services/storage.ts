import { getStorageSchema, saveToStorage, clearStorage, isStorageFull } from '@/lib/storage-schema';
import { encryptStorageItem, decryptStorageItem } from '@/lib/storage-encrypt';
import { syncLocalToCloud, syncCloudToLocal } from '@/lib/storage-sync';
import { initializeStorage, initializeUserStorage } from '@/lib/storage-init';
import { cleanupExpiredData, checkAutoDelete, runStorageCleanup } from '@/lib/storage-cleanup';
import { handleStorageFull } from '@/lib/storage-full';

export class StorageService {
  static init(userId?: string) {
    return initializeStorage(userId);
  }

  static initUser(userId: string) {
    initializeUserStorage(userId);
  }

  static saveDocument(doc: {
    id: string;
    title: string;
    content: string;
    format: string;
    wordCount: number;
    status: string;
  }) {
    const schema = getStorageSchema();
    const existing = schema.documents.findIndex((d) => d.id === doc.id);
    const entry = { ...doc, updatedAt: new Date().toISOString() };

    if (existing >= 0) {
      schema.documents[existing] = { ...schema.documents[existing], ...entry };
    } else {
      schema.documents.push({ ...entry, createdAt: new Date().toISOString() });
    }

    saveToStorage({ documents: schema.documents });
  }

  static getDocument(id: string) {
    const schema = getStorageSchema();
    return schema.documents.find((d) => d.id === id) || null;
  }

  static getDocuments(filter?: { status?: string; format?: string }) {
    const schema = getStorageSchema();
    let docs = schema.documents;
    if (filter?.status) docs = docs.filter((d) => d.status === filter.status);
    if (filter?.format) docs = docs.filter((d) => d.format === filter.format);
    return docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static deleteDocument(id: string) {
    const schema = getStorageSchema();
    schema.documents = schema.documents.filter((d) => d.id !== id);
    saveToStorage({ documents: schema.documents });
  }

  static saveSettings(settings: Record<string, unknown>) {
    const schema = getStorageSchema();
    schema.settings = { ...schema.settings, ...settings };
    saveToStorage({ settings: schema.settings });
  }

  static getSettings(): Record<string, unknown> {
    return getStorageSchema().settings;
  }

  static saveTemplate(template: { id: string; name: string; isFavorited: boolean; lastUsed?: string }) {
    const schema = getStorageSchema();
    const existing = schema.templates.findIndex((t) => t.id === template.id);
    if (existing >= 0) {
      schema.templates[existing] = { ...schema.templates[existing], ...template };
    } else {
      schema.templates.push(template);
    }
    saveToStorage({ templates: schema.templates });
  }

  static getTemplates(favoritesOnly = false) {
    const schema = getStorageSchema();
    return favoritesOnly
      ? schema.templates.filter((t) => t.isFavorited)
      : schema.templates;
  }

  static logActivity(action: string, details = '') {
    const schema = getStorageSchema();
    schema.activityLog.unshift({
      action,
      timestamp: new Date().toISOString(),
      details,
    });
    schema.activityLog = schema.activityLog.slice(0, 200);
    saveToStorage({ activityLog: schema.activityLog });
  }

  static getActivityLog() {
    return getStorageSchema().activityLog;
  }

  static encryptAndSave(key: string, value: string) {
    encryptStorageItem(key, value);
  }

  static getDecrypted(key: string) {
    return decryptStorageItem(key);
  }

  static async syncToCloud(userId: string) {
    return syncLocalToCloud(userId);
  }

  static async syncFromCloud(userId: string) {
    return syncCloudToLocal(userId);
  }

  static cleanup() {
    cleanupExpiredData();
  }

  static checkAutoDelete(credits: number) {
    return checkAutoDelete(credits);
  }

  static getStorageHealth() {
    return handleStorageFull();
  }

  static clear() {
    clearStorage();
  }

  static runFullCleanup() {
    runStorageCleanup();
  }
}
