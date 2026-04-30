import { getStorageSchema, saveToStorage, clearStorage } from './storage-schema';

const AUTO_DELETE_HOURS = 24;
const AUTO_DELETE_CREDIT_THRESHOLD = 10;

export function cleanupExpiredData(): { cleaned: boolean; reason?: string } {
  const schema = getStorageSchema();
  const now = Date.now();
  const ageMs = now - schema.updatedAt;
  const ageHours = ageMs / (1000 * 60 * 60);

  if (schema.isAnonymous && ageHours > AUTO_DELETE_HOURS) {
    clearStorage();
    return { cleaned: true, reason: 'Anonymous data expired after 24 hours' };
  }

  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  schema.documents = schema.documents.filter((doc) => {
    const docAge = now - new Date(doc.updatedAt).getTime();
    if (docAge > thirtyDaysMs && doc.status === 'draft') return false;
    return true;
  });

  schema.activityLog = schema.activityLog.slice(0, 200);
  saveToStorage(schema);

  return { cleaned: false };
}

export function checkAutoDelete(userCredits: number): {
  willAutoDelete: boolean;
  hoursRemaining: number;
} {
  if (userCredits >= AUTO_DELETE_CREDIT_THRESHOLD) {
    return { willAutoDelete: false, hoursRemaining: 0 };
  }

  const schema = getStorageSchema();
  if (!schema.isAnonymous) {
    return { willAutoDelete: false, hoursRemaining: 0 };
  }

  const now = Date.now();
  const ageMs = now - schema.createdAt;
  const hoursPassed = ageMs / (1000 * 60 * 60);
  const hoursRemaining = Math.max(0, AUTO_DELETE_HOURS - hoursPassed);

  return {
    willAutoDelete: true,
    hoursRemaining: Math.round(hoursRemaining),
  };
}

export function runStorageCleanup(): void {
  cleanupExpiredData();
  
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('cremy_')) keys.push(key);
    }

    const now = Date.now();
    keys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          if (parsed && parsed.createdAt && now - parsed.createdAt > 30 * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
          }
        }
      } catch {}
    });
  } catch {}
}
