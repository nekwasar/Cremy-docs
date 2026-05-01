import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: string;
  timestamp: string;
  services: {
    mongodb: {
      status: string;
      latency?: number;
      error?: string;
    };
    redis: {
      status: string;
      latency?: number;
      error?: string;
    };
  };
}

export async function GET() {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: { status: 'unknown' },
      redis: { status: 'unknown' },
    },
  };

  let allHealthy = true;

  const mongodbStart = Date.now();
  try {
    await connectDB();
    const mongoState = mongoose.connection.readyState;
    if (mongoState === 1) {
      health.services.mongodb = {
        status: 'healthy',
        latency: Date.now() - mongodbStart,
      };
    } else {
      health.services.mongodb = {
        status: 'unhealthy',
        error: `Connection state: ${mongoState}`,
      };
      allHealthy = false;
    }
  } catch (error) {
    health.services.mongodb = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    allHealthy = false;
  }

  const redisStart = Date.now();
  try {
    const redis = getRedis();
    const result = await redis.ping();
    if (result === 'PONG') {
      health.services.redis = {
        status: 'healthy',
        latency: Date.now() - redisStart,
      };
    } else {
      health.services.redis = {
        status: 'unhealthy',
        error: `Unexpected response: ${result}`,
      };
      allHealthy = false;
    }
  } catch (error) {
    health.services.redis = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    allHealthy = false;
  }

  health.status = allHealthy ? 'healthy' : 'degraded';

  return NextResponse.json(health, {
    status: allHealthy ? 200 : 503,
  });
}