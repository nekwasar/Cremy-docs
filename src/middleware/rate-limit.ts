import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

interface RateLimitConfig {
  endpoint: string;
  windowMs: number;
  maxRequests: number;
  strategy: 'sliding' | 'fixed';
}

const RATE_LIMITS: RateLimitConfig[] = [
  { endpoint: '/api/login', windowMs: 60000, maxRequests: 5, strategy: 'sliding' },
  { endpoint: '/api/register', windowMs: 3600000, maxRequests: 3, strategy: 'fixed' },
  { endpoint: '/api/auth/forgot-password', windowMs: 86400000, maxRequests: 3, strategy: 'fixed' },
  { endpoint: '/api/generate', windowMs: 60000, maxRequests: 10, strategy: 'sliding' },
  { endpoint: '/api/edit', windowMs: 60000, maxRequests: 20, strategy: 'sliding' },
  { endpoint: '/api/convert', windowMs: 60000, maxRequests: 10, strategy: 'sliding' },
  { endpoint: '/api/translate', windowMs: 60000, maxRequests: 15, strategy: 'sliding' },
  { endpoint: '/api/voice', windowMs: 60000, maxRequests: 5, strategy: 'sliding' },
];

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

function getMatchingConfig(endpoint: string): RateLimitConfig | null {
  for (const config of RATE_LIMITS) {
    if (endpoint.startsWith(config.endpoint)) {
      return config;
    }
  }
  return null;
}

async function checkSlidingWindow(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult> {
  const redis = getRedis();
  const now = Date.now();
  const windowStart = now - windowMs;

  const existingRequests = await redis.zrangebyscore(key, windowStart, now);
  
  if (existingRequests.length < maxRequests) {
    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.expire(key, Math.ceil(windowMs / 1000));
    
    return {
      allowed: true,
      remaining: maxRequests - existingRequests.length - 1,
      resetAt: now + windowMs,
      retryAfter: 0,
    };
  }

  const oldestRequest = existingRequests[0];
  const oldestTime = parseInt(oldestRequest.split('-')[0]);
  const resetAt = oldestTime + windowMs;

  return {
    allowed: false,
    remaining: 0,
    resetAt,
    retryAfter: Math.ceil((resetAt - now) / 1000),
  };
}

async function checkFixedWindow(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult> {
  const redis = getRedis();
  const now = Date.now();
  const windowKey = Math.floor(now / windowMs).toString();
  const fullKey = `${key}:${windowKey}`;

  const count = await redis.get(fullKey);
  const currentCount = count ? parseInt(count) : 0;

  if (currentCount < maxRequests) {
    await redis.incr(fullKey);
    await redis.expire(fullKey, Math.ceil(windowMs / 1000));
    
    return {
      allowed: true,
      remaining: maxRequests - currentCount - 1,
      resetAt: (Math.floor(now / windowMs) + 1) * windowMs,
      retryAfter: 0,
    };
  }

  const resetAt = (Math.floor(now / windowMs) + 1) * windowMs;

  return {
    allowed: false,
    remaining: 0,
    resetAt,
    retryAfter: Math.ceil((resetAt - now) / 1000),
  };
}

export async function rateLimit(
  request: NextRequest
): Promise<RateLimitResult | null> {
  const endpoint = request.nextUrl.pathname;
  const config = getMatchingConfig(endpoint);

  if (!config) {
    return null;
  }

  const clientIp = getClientIp(request);
  const key = `ratelimit:${endpoint}:${clientIp}`;

  if (config.strategy === 'sliding') {
    return checkSlidingWindow(key, config.windowMs, config.maxRequests);
  } else {
    return checkFixedWindow(key, config.windowMs, config.maxRequests);
  }
}

export function createRateLimitMiddleware() {
  return async function rateLimitMiddleware(
    request: NextRequest
  ): Promise<NextResponse | null> {
    const result = await rateLimit(request);

    if (result && !result.allowed) {
      const response = NextResponse.json(
        {
          error: {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: result.retryAfter,
          },
        },
        { status: 429 }
      );

      response.headers.set('Retry-After', result.retryAfter.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set(
        'X-RateLimit-Reset',
        new Date(result.resetAt).toISOString()
      );

      return response;
    }

    if (result) {
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set(
        'X-RateLimit-Reset',
        new Date(result.resetAt).toISOString()
      );
      return response;
    }

    return null;
  };
}
