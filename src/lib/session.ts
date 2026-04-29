interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  rememberMe: boolean;
}

const SESSION_KEY = 'session_data';

export function saveSession(data: SessionData): void {
  try {
    if (data.rememberMe) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    }
  } catch {}
}

export function loadSession(): SessionData | null {
  try {
    const stored =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const data: SessionData = JSON.parse(stored);
    
    if (data.expiresAt && data.expiresAt < Date.now()) {
      clearSession();
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function updateAccessToken(token: string, expiresIn: number): void {
  try {
    const session = loadSession();
    if (!session) return;

    session.accessToken = token;
    session.expiresAt = Date.now() + expiresIn * 1000;
    saveSession(session);
  } catch {}
}

export function isSessionValid(): boolean {
  const session = loadSession();
  if (!session) return false;
  return session.expiresAt > Date.now();
}