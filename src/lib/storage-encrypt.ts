const ENCRYPTION_PREFIX = 'enc:';

export function encryptData(data: string): string {
  try {
    const encoded = btoa(unescape(encodeURIComponent(data)));
    return ENCRYPTION_PREFIX + encoded;
  } catch {
    return data;
  }
}

export function decryptData(encrypted: string): string {
  if (!encrypted.startsWith(ENCRYPTION_PREFIX)) return encrypted;
  try {
    return decodeURIComponent(escape(atob(encrypted.slice(ENCRYPTION_PREFIX.length))));
  } catch {
    return encrypted.slice(ENCRYPTION_PREFIX.length);
  }
}

export function encryptStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, encryptData(value));
  } catch {}
}

export function decryptStorageItem(key: string): string | null {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return decryptData(value);
  } catch {
    return null;
  }
}
