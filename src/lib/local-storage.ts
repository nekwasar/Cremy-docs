const DRAFTS_KEY = 'documents_drafts';
const SETTINGS_KEY = 'user_settings';
const ANON_DOCUMENTS_KEY = 'anon_documents';

interface DraftDocument {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export function saveDraft(document: DraftDocument): void {
  try {
    const drafts = loadDrafts();
    
    const existingIndex = drafts.findIndex((d) => d.id === document.id);
    if (existingIndex >= 0) {
      drafts[existingIndex] = document;
    } else {
      drafts.push(document);
    }

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {}
}

export function loadDrafts(): DraftDocument[] {
  try {
    const stored = localStorage.getItem(DRAFTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function removeDraft(id: string): void {
  try {
    const drafts = loadDrafts().filter((d) => d.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {}
}

export function clearDrafts(): void {
  localStorage.removeItem(DRAFTS_KEY);
}

export function cleanExpiredDrafts(expirationHours: number = 24): void {
  const now = Date.now();
  const expirationMs = expirationHours * 60 * 60 * 1000;

  try {
    const drafts = loadDrafts().filter((d) => {
      const updatedTime = new Date(d.updatedAt).getTime();
      return now - updatedTime < expirationMs;
    });

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {}
}

export function saveSettings(settings: Record<string, unknown>): void {
  try {
    const current = loadSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch {}
}

export function loadSettings(): Record<string, unknown> {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function clearSettings(): void {
  localStorage.removeItem(SETTINGS_KEY);
}

export function saveAnonymousDocument(document: DraftDocument): void {
  try {
    const docs = loadAnonymousDocuments();
    docs.push(document);
    localStorage.setItem(ANON_DOCUMENTS_KEY, JSON.stringify(docs));
  } catch {}
}

export function loadAnonymousDocuments(): DraftDocument[] {
  try {
    const stored = localStorage.getItem(ANON_DOCUMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearAnonymousDocuments(): void {
  localStorage.removeItem(ANON_DOCUMENTS_KEY);
}

export function clearAllLocalData(): void {
  clearDrafts();
  clearSettings();
  clearAnonymousDocuments();
}