import { getRedis } from './redis';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private keyPrefix: string;

  constructor(config: RateLimitConfig) {
    this.windowMs = config.windowMs;
    this.maxRequests = config.maxRequests;
    this.keyPrefix = config.keyPrefix || 'rate-limit';
  }

  private getKey(identifier: string): string {
    return `${this.keyPrefix}:${identifier}`;
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const redis = getRedis();
    const key = this.getKey(identifier);
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const current = await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.zremrangebyscore(key, 0, windowStart);

    const remaining = Math.max(0, this.maxRequests - current);
    const resetTime = now + this.windowMs;

    if (current > this.maxRequests) {
      await redis.zrem(key, `${now}-${Math.random()}`);
    }

    await redis.expire(key, Math.ceil(this.windowMs / 1000));

    return {
      allowed: current <= this.maxRequests,
      remaining,
      resetTime,
    };
  }

  async reset(identifier: string): Promise<void> {
    const redis = getRedis();
    const key = this.getKey(identifier);
    await redis.del(key);
  }
}

export const authRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  keyPrefix: 'ratelimit:auth',
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  keyPrefix: 'ratelimit:api',
});

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}