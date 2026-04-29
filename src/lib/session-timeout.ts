const EXPIRY_CHECK_INTERVAL = 30000;

let expiryCheckInterval: NodeJS.Timeout | null = null;

export function startSessionTimeout(
  onExpired: () => void,
  intervalMs: number = EXPIRY_CHECK_INTERVAL
): void {
  if (expiryCheckInterval) return;

  expiryCheckInterval = setInterval(() => {
    const sessionData = typeof window !== 'undefined'
      ? window.localStorage.getItem('session_data')
      : null;

    if (!sessionData) {
      onExpired();
      stopSessionTimeout();
      return;
    }

    try {
      const session = JSON.parse(sessionData);
      if (session.expiresAt && session.expiresAt < Date.now()) {
        onExpired();
        stopSessionTimeout();
      }
    } catch {
      onExpired();
      stopSessionTimeout();
    }
  }, intervalMs);
}

export function stopSessionTimeout(): void {
  if (expiryCheckInterval) {
    clearInterval(expiryCheckInterval);
    expiryCheckInterval = null;
  }
}

export function getSessionRemainingTime(): number {
  const sessionData = typeof window !== 'undefined'
    ? window.localStorage.getItem('session_data')
    : null;

  if (!sessionData) return 0;

  try {
    const session = JSON.parse(sessionData);
    return Math.max(0, session.expiresAt - Date.now());
  } catch {
    return 0;
  }
}