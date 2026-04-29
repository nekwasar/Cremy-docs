import { getRedis } from '@/lib/redis';

const MAX_CONCURRENT = 1;
const QUEUE_KEY_PREFIX = 'queue:generate:';

interface QueuedRequest {
  id: string;
  userId: string;
  timestamp: number;
  payload: any;
}

const activeGenerations = new Map<string, string>();
const requestQueue: QueuedRequest[] = [];

export async function checkConcurrentLimit(userId: string): Promise<{
  allowed: boolean;
  queuePosition: number;
}> {
  const activeKey = `active:generate:${userId}`;
  const redis = await getRedis();
  
  const isActive = await redis.get(activeKey);
  
  if (!isActive) {
    await redis.set(activeKey, '1', 'EX', 300);
    return { allowed: true, queuePosition: 0 };
  }

  const queueKey = `${QUEUE_KEY_PREFIX}${userId}`;
  const position = await redis.lpush(queueKey, JSON.stringify({
    id: `req-${Date.now()}`,
    userId,
    timestamp: Date.now(),
  }));
  
  await redis.expire(queueKey, 300);

  return { allowed: false, queuePosition: position };
}

export async function releaseConcurrentLimit(userId: string): Promise<void> {
  const activeKey = `active:generate:${userId}`;
  const redis = await getRedis();
  
  await redis.del(activeKey);

  const queueKey = `${QUEUE_KEY_PREFIX}${userId}`;
  await redis.lpop(queueKey);
}

export async function getQueuePosition(userId: string): Promise<number> {
  const queueKey = `${QUEUE_KEY_PREFIX}${userId}`;
  const redis = await getRedis();
  
  const length = await redis.llen(queueKey);
  return length;
}

export async function clearUserQueue(userId: string): Promise<void> {
  const queueKey = `${QUEUE_KEY_PREFIX}${userId}`;
  const redis = await getRedis();
  
  await redis.del(queueKey);
  await redis.del(`active:generate:${userId}`);
}