import { getRedis } from '@/lib/redis';

interface AdminGenerationStatus {
  isPaused: boolean;
  queueSize: number;
  activeGenerations: number;
}

const ADMIN_STATUS_KEY = 'admin:generation:status';

export async function pauseGenerations(): Promise<void> {
  const redis = await getRedis();
  await redis.set(ADMIN_STATUS_KEY, JSON.stringify({ isPaused: true }));
}

export async function resumeGenerations(): Promise<void> {
  const redis = await getRedis();
  await redis.set(ADMIN_STATUS_KEY, JSON.stringify({ isPaused: false }));
}

export async function isGenerationPaused(): Promise<boolean> {
  const redis = await getRedis();
  const status = await redis.get(ADMIN_STATUS_KEY);
  
  if (!status) return false;
  
  try {
    const parsed = JSON.parse(status);
    return parsed.isPaused || false;
  } catch {
    return false;
  }
}

export async function clearQueue(): Promise<void> {
  const redis = await getRedis();
  
  const keys = await redis.keys('queue:generate:*');
  
  for (const key of keys) {
    await redis.del(key);
  }
}

export async function getGenerationStatus(): Promise<AdminGenerationStatus> {
  const redis = await getRedis();
  
  const statusStr = await redis.get(ADMIN_STATUS_KEY);
  let isPaused = false;
  
  try {
    if (statusStr) {
      isPaused = JSON.parse(statusStr).isPaused;
    }
  } catch {}

  const queueKeys = await redis.keys('queue:generate:*');
  let queueSize = 0;
  
  for (const key of queueKeys) {
    const length = await redis.llen(key);
    queueSize += length;
  }

  const activeKeys = await redis.keys('active:generate:*');
  const activeGenerations = activeKeys.length;

  return { isPaused, queueSize, activeGenerations };
}