import { getAIConfig } from '@/lib/ai-config';

interface APIKeyStore {
  keys: Array<{
    key: string;
    inUse: boolean;
    usageCount: number;
  }>;
  currentIndex: number;
}

let keyStore: APIKeyStore | null = null;

export async function loadAPIKeys(): Promise<void> {
  const config = await getAIConfig();
  if (!config) return;

  keyStore = {
    keys: [{ key: config.apiKey, inUse: false, usageCount: 0 }],
    currentIndex: 0,
  };
}

export function getCurrentKey(): string | null {
  if (!keyStore || keyStore.keys.length === 0) return null;
  return keyStore.keys[keyStore.currentIndex].key;
}

export function rotateKey(): void {
  if (!keyStore || keyStore.keys.length <= 1) return;

  keyStore.keys[keyStore.currentIndex].inUse = false;
  keyStore.currentIndex = (keyStore.currentIndex + 1) % keyStore.keys.length;
  keyStore.keys[keyStore.currentIndex].inUse = true;
}

export function recordKeyUsage(): void {
  if (!keyStore) return;
  keyStore.keys[keyStore.currentIndex].usageCount++;
}