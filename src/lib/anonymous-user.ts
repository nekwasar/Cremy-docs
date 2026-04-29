import { v4 as uuidv4 } from 'uuid';

const ANONYMOUS_CREDITS = 5;
const AUTO_DELETE_THRESHOLD_HOURS = 24;

export interface AnonymousUser {
  id: string;
  credits: number;
  createdAt: Date;
  lastActiveAt: Date;
  documents: AnonymousDocument[];
}

export interface AnonymousDocument {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export function createAnonymousUser(): AnonymousUser {
  return {
    id: uuidv4(),
    credits: ANONYMOUS_CREDITS,
    createdAt: new Date(),
    lastActiveAt: new Date(),
    documents: [],
  };
}

export function loadAnonymousUser(): AnonymousUser | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('anonymous_user');
  if (!stored) return null;
  
  try {
    const user = JSON.parse(stored) as AnonymousUser;
    user.createdAt = new Date(user.createdAt);
    user.lastActiveAt = new Date(user.lastActiveAt);
    
    for (const doc of user.documents) {
      doc.createdAt = new Date(doc.createdAt);
    }
    
    return user;
  } catch {
    return null;
  }
}

export function saveAnonymousUser(user: AnonymousUser): void {
  if (typeof window === 'undefined') return;
  
  user.lastActiveAt = new Date();
  localStorage.setItem('anonymous_user', JSON.stringify(user));
}

export function addAnonymousCredits(amount: number): AnonymousUser | null {
  const user = loadAnonymousUser();
  if (!user) return null;
  
  user.credits += amount;
  saveAnonymousUser(user);
  return user;
}

export function deductAnonymousCredits(amount: number): boolean {
  const user = loadAnonymousUser();
  if (!user || user.credits < amount) return false;
  
  user.credits -= amount;
  saveAnonymousUser(user);
  return true;
}

export function saveAnonymousDocument(doc: { id: string; title: string; content: string }): void {
  const user = loadAnonymousUser();
  if (!user) return;
  
  user.documents.push({
    ...doc,
    createdAt: new Date(),
  });
  saveAnonymousUser(user);
}

export function shouldAutoDeleteAnonymousUser(): boolean {
  const user = loadAnonymousUser();
  if (!user) return false;
  
  const hoursSinceCreation = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreation >= AUTO_DELETE_THRESHOLD_HOURS && user.credits < 10;
}

export function clearAnonymousUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('anonymous_user');
}

export function migrateAnonymousToRegistered(
  anonymousData: AnonymousUser,
  userId: string
): { credits: number; documents: AnonymousDocument[] } {
  return {
    credits: anonymousData.credits,
    documents: anonymousData.documents,
  };
}