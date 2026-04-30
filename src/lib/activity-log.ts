const LOG_KEY = 'activity_log';

export function isLoggingEnabled(): boolean {
  return localStorage.getItem(LOG_KEY) !== 'false';
}

export function setLoggingEnabled(enabled: boolean): void {
  localStorage.setItem(LOG_KEY, String(enabled));
}

export function getActivityLog(): Array<{ action: string; timestamp: string; details: string }> {
  try {
    const stored = localStorage.getItem('activity_history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function logActivity(action: string, details: string = ''): void {
  if (!isLoggingEnabled()) return;

  const log = getActivityLog();
  log.unshift({
    action,
    timestamp: new Date().toISOString(),
    details,
  });

  const trimmed = log.slice(0, 100);
  try {
    localStorage.setItem('activity_history', JSON.stringify(trimmed));
  } catch {}
}

export function clearActivityLog(): void {
  localStorage.removeItem('activity_history');
}
