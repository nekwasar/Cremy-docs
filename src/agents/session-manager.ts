import { getMongoDb } from '@/lib/mongodb';

interface SessionData {
  sessionId: string;
  userId?: string;
  messages: Array<{ role: 'user' | 'agent'; content: string }>;
  uploadedFiles: Array<{ id: string; name: string; type: string }>;
  createdAt: Date;
  expiresAt: Date;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  try {
    const db = await getMongoDb();
    const session = await db.collection('sessions').findOne({ sessionId });
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      await db.collection('sessions').deleteOne({ sessionId });
      return null;
    }

    return session as SessionData;
  } catch {
    return null;
  }
}

export async function createSession(
  sessionId: string,
  userId?: string
): Promise<SessionData> {
  const db = await getMongoDb();
  const now = new Date();
  const session: SessionData = {
    sessionId,
    userId,
    messages: [],
    uploadedFiles: [],
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
  };

  await db.collection('sessions').insertOne(session);
  return session;
}

export async function addMessage(
  sessionId: string,
  role: 'user' | 'agent',
  content: string
): Promise<void> {
  try {
    const db = await getMongoDb();
    await db.collection('sessions').updateOne(
      { sessionId },
      {
        $push: { messages: { role, content } },
        $set: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      }
    );
  } catch {}
}

export async function addFileToSession(
  sessionId: string,
  file: { id: string; name: string; type: string }
): Promise<void> {
  try {
    const db = await getMongoDb();
    await db.collection('sessions').updateOne(
      { sessionId },
      {
        $push: { uploadedFiles: file },
        $set: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      }
    );
  } catch {}
}

export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const db = await getMongoDb();
    const result = await db.collection('sessions').deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount;
  } catch {
    return 0;
  }
}
