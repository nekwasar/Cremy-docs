export interface StorageSchema {
  version: number;
  userId: string;
  isAnonymous: boolean;
  createdAt: number;
  updatedAt: number;
  documents: Array<{
    id: string;
    title: string;
    content: string;
    format: string;
    wordCount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  settings: Record<string, unknown>;
  templates: Array<{
    id: string;
    name: string;
    isFavorited: boolean;
    lastUsed?: string;
  }>;
  activityLog: Array<{
    action: string;
    timestamp: string;
    details: string;
  }>;
}

const STORAGE_KEY = 'cremy_storage';
const STORAGE_VERSION = 1;

export function getStorageSchema(): StorageSchema {
  const defaultSchema: StorageSchema = {
    version: STORAGE_VERSION,
    userId: '',
    isAnonymous: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    documents: [],
    settings: {},
    templates: [],
    activityLog: [],
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSchema;

    const parsed = JSON.parse(stored);
    if (parsed.version !== STORAGE_VERSION) {
      return migrateSchema(parsed);
    }
    return { ...defaultSchema, ...parsed };
  } catch {
    return defaultSchema;
  }
}

function migrateSchema(old: any): StorageSchema {
  return {
    version: STORAGE_VERSION,
    userId: old.userId || '',
    isAnonymous: old.isAnonymous ?? true,
    createdAt: old.createdAt || Date.now(),
    updatedAt: Date.now(),
    documents: old.documents || [],
    settings: old.settings || {},
    templates: old.templates || [],
    activityLog: old.activityLog || [],
  };
}

export function saveToStorage(data: Partial<StorageSchema>): void {
  const current = getStorageSchema();
  const updated = { ...current, ...data, updatedAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isStorageFull(): boolean {
  try {
    const test = 'x'.repeat(1024);
    localStorage.setItem('__test__', test);
    localStorage.removeItem('__test__');
    return false;
  } catch {
    return true;
  }
}

export function getStorageUsage(): { used: number; available: number } {
  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      used += (localStorage.getItem(key) || '').length * 2;
    }
  }
  return { used, available: 5 * 1024 * 1024 };
}
