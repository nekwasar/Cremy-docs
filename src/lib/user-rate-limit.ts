import { getRedis } from '@/lib/redis';

const GENERATIONS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW_MS = 60000;

export async function checkUserRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const redis = await getRedis();
  const key = `rate:generate:${userId}`;
  
  const currentCount = await redis.incr(key);
  
  if (currentCount === 1) {
    await redis.expire(key, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));
  }

  const ttl = await redis.ttl(key);
  const resetAt = Date.now() + (ttl * 1000);
  const remaining = Math.max(0, GENERATIONS_PER_MINUTE - currentCount);

  return {
    allowed: currentCount <= GENERATIONS_PER_MINUTE,
    remaining,
    resetAt,
  };
}

export async function resetUserRateLimit(userId: string): Promise<void> {
  const redis = await getRedis();
  const key = `rate:generate:${userId}`;
  await redis.del(key);
}

export async function getUserRateLimitStatus(userId: string): Promise<{
  count: number;
  limit: number;
  resetAt: number;
}> {
  const redis = await getRedis();
  const key = `rate:generate:${userId}`;
  
  const count = await redis.get(key);
  const ttl = await redis.ttl(key);

  return {
    count: parseInt(count || '0'),
    limit: GENERATIONS_PER_MINUTE,
    resetAt: ttl > 0 ? Date.now() + (ttl * 1000) : Date.now(),
  };
}