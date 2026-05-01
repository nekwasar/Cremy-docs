import { v4 as uuidv4 } from 'uuid';

const ANONYMOUS_STORAGE_KEY = 'cremy_anon_user';
const ANONYMOUS_CREDITS = 5;
const AUTO_DELETE_CREDITS_THRESHOLD = 10;
const AUTO_DELETE_HOURS = 24;

interface AnonymousUserData {
  id: string;
  credits: number;
  createdAt: number;
  lastActive: number;
  documents: AnonymousDocument[];
  settings: Record<string, unknown>;
}

interface AnonymousDocument {
  id: string;
  title: string;
  content: string;
  type: 'generated' | 'uploaded' | 'template';
  createdAt: number;
}

export function createAnonymousUser(): AnonymousUserData {
  const user: AnonymousUserData = {
    id: uuidv4(),
    credits: ANONYMOUS_CREDITS,
    createdAt: Date.now(),
    lastActive: Date.now(),
    documents: [],
    settings: {},
  };

  saveAnonymousUser(user);
  return user;
}

export function getAnonymousUser(): AnonymousUserData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(ANONYMOUS_STORAGE_KEY);
    if (!stored) return null;

    const user = JSON.parse(stored) as AnonymousUserData;
    user.lastActive = Date.now();
    saveAnonymousUser(user);
    return user;
  } catch {
    return null;
  }
}

export function saveAnonymousUser(user: AnonymousUserData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ANONYMOUS_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save anonymous user:', e);
  }
}

export function checkAnonymousUserExpired(): boolean {
  const user = getAnonymousUser();
  if (!user) return false;

  const hoursSinceCreation = (Date.now() - user.createdAt) / (1000 * 60 * 60);
  const hasLowCredits = user.credits < AUTO_DELETE_CREDITS_THRESHOLD;

  return hoursSinceCreation >= AUTO_DELETE_HOURS && hasLowCredits;
}

export function deleteAnonymousUser(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ANONYMOUS_STORAGE_KEY);
}

export function getAnonymousCredits(): number {
  const user = getAnonymousUser();
  return user?.credits ?? ANONYMOUS_CREDITS;
}

export function deductAnonymousCredits(amount: number): boolean {
  const user = getAnonymousUser();
  if (!user) return false;

  if (user.credits < amount) return false;

  user.credits -= amount;
  user.lastActive = Date.now();
  saveAnonymousUser(user);
  return true;
}

export function addAnonymousCredits(amount: number): void {
  let user = getAnonymousUser();
  if (!user) {
    user = createAnonymousUser();
  }

  user.credits += amount;
  user.lastActive = Date.now();
  saveAnonymousUser(user);
}

export function addAnonymousDocument(
  title: string,
  content: string,
  type: 'generated' | 'uploaded' | 'template'
): AnonymousDocument {
  let user = getAnonymousUser();
  if (!user) {
    user = createAnonymousUser();
  }

  const doc: AnonymousDocument = {
    id: uuidv4(),
    title,
    content,
    type,
    createdAt: Date.now(),
  };

  user.documents.push(doc);
  user.lastActive = Date.now();
  saveAnonymousUser(user);

  return doc;
}

export function getAnonymousDocuments(): AnonymousDocument[] {
  const user = getAnonymousUser();
  return user?.documents ?? [];
}

export function deleteAnonymousDocument(id: string): boolean {
  const user = getAnonymousUser();
  if (!user) return false;

  const index = user.documents.findIndex((d) => d.id === id);
  if (index === -1) return false;

  user.documents.splice(index, 1);
  user.lastActive = Date.now();
  saveAnonymousUser(user);

  return true;
}

export function updateAnonymousSettings(settings: Record<string, unknown>): void {
  let user = getAnonymousUser();
  if (!user) {
    user = createAnonymousUser();
  }

  user.settings = { ...user.settings, ...settings };
  user.lastActive = Date.now();
  saveAnonymousUser(user);
}

export function getAnonymousSettings(): Record<string, unknown> {
  const user = getAnonymousUser();
  return user?.settings ?? {};
}

export function migrateAnonymousToRegistered(uid: string): { credits: number; documents: AnonymousDocument[] } {
  const user = getAnonymousUser();
  if (!user) {
    return { credits: ANONYMOUS_CREDITS, documents: [] };
  }

  const data = {
    credits: user.credits,
    documents: user.documents,
  };

  deleteAnonymousUser();
  return data;
}

export function isUserAnonymous(): boolean {
  return typeof window !== 'undefined' && !getAnonymousUser();
}

export type { AnonymousUserData, AnonymousDocument };