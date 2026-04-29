const STATE_KEY_PREFIX = 'cremy_state_';

interface RecoverableState<T> {
  key: string;
  defaultValue: T;
  validate: (data: unknown) => data is T;
}

export function recoverState<T>(option: RecoverableState<T>): T {
  try {
    const stored = localStorage.getItem(`${STATE_KEY_PREFIX}${option.key}`);
    
    if (!stored) {
      return option.defaultValue;
    }

    const parsed = JSON.parse(stored);
    
    if (option.validate(parsed)) {
      return parsed;
    }

    return option.defaultValue;
  } catch {
    return option.defaultValue;
  }
}

export function saveState<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`${STATE_KEY_PREFIX}${key}`, JSON.stringify(data));
  } catch {}
}

export function removeState(key: string): void {
  try {
    localStorage.removeItem(`${STATE_KEY_PREFIX}${key}`);
  } catch {}
}

export function clearAllStates(): void {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STATE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {}
}

export function validateBoolean(data: unknown): data is boolean {
  return typeof data === 'boolean';
}

export function validateString(data: unknown): data is string {
  return typeof data === 'string';
}

export function validateObject(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}