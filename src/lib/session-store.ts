import { getRedis } from './redis';
import { v4 as uuidv4 } from 'uuid';

export interface SessionData {
  sid: string;
  uid: string;
  exp: number;
  iat: number;
  ip: string;
  ua: string;
}

const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

export async function createSession(
  uid: string,
  ip: string,
  ua: string
): Promise<SessionData> {
  const redis = getRedis();
  const sid = uuidv4();
  const now = Date.now();
  
  const session: SessionData = {
    sid,
    uid,
    exp: now + (SESSION_TTL * 1000),
    iat: now,
    ip,
    ua,
  };

  const key = `sess:${sid}:${uid}:${Math.floor(session.exp / 1000)}`;
  await redis.setex(key, SESSION_TTL, JSON.stringify(session));

  return session;
}

export async function getSession(sid: string): Promise<SessionData | null> {
  const redis = getRedis();
  
  const keys = await redis.keys(`sess:${sid}:*`);
  if (keys.length === 0) return null;
  
  const sessionData = await redis.get(keys[0]);
  if (!sessionData) return null;
  
  return JSON.parse(sessionData);
}

export async function refreshSession(sid: string): Promise<SessionData | null> {
  const session = await getSession(sid);
  if (!session) return null;
  
  const redis = getRedis();
  const now = Date.now();
  session.exp = now + (SESSION_TTL * 1000);
  session.iat = now;
  
  const key = `sess:${sid}:${session.uid}:${Math.floor(session.exp / 1000)}`;
  await redis.setex(key, SESSION_TTL, JSON.stringify(session));
  
  return session;
}

export async function destroySession(sid: string): Promise<void> {
  const redis = getRedis();
  const keys = await redis.keys(`sess:${sid}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  const redis = getRedis();
  const keys = await redis.keys('sess:*');
  
  for (const key of keys) {
    const ttl = await redis.ttl(key);
    if (ttl <= 0) {
      await redis.del(key);
    }
  }
}

export async function getUserSessions(uid: string): Promise<SessionData[]> {
  const redis = getRedis();
  const keys = await redis.keys(`sess:*:${uid}:*`);
  const sessions: SessionData[] = [];
  
  for (const key of keys) {
    const sessionData = await redis.get(key);
    if (sessionData) {
      sessions.push(JSON.parse(sessionData));
    }
  }
  
  return sessions;
}

export async function destroyAllUserSessions(uid: string): Promise<void> {
  const redis = getRedis();
  const keys = await redis.keys(`sess:*:${uid}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
