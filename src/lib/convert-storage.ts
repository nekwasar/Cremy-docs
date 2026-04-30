const convertCache = new Map<string, { blob: Blob; timestamp: number }>();

export function storeConvertedFile(id: string, blob: Blob): void {
  convertCache.set(id, { blob, timestamp: Date.now() });
}

export function getConvertedFile(id: string): Blob | null {
  const entry = convertCache.get(id);
  if (!entry) return null;
  return entry.blob;
}

export function cleanupOldFiles(maxAgeMs: number = 30 * 60 * 1000): void {
  const now = Date.now();
  convertCache.forEach((entry, id) => {
    if (now - entry.timestamp > maxAgeMs) {
      convertCache.delete(id);
    }
  });
}

export function clearAllFiles(): void {
  convertCache.clear();
}
