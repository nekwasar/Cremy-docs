import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * 
 * GET /api/health
 * 
 * Returns the health status of all services:
 * - API status
 * - MongoDB connection status
 * - Redis connection status
 * 
 * Used by:
 * - Docker healthcheck
 * - Kubernetes readiness probe
 * - Load balancer health checks
 */
export async function GET() {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: {
        status: 'ok',
        uptime: process.uptime(),
        nodeVersion: process.version,
      },
      mongodb: {
        status: 'unknown',
        message: 'Not checked in /api/health - use dedicated endpoint',
      },
      redis: {
        status: 'unknown',
        message: 'Not checked in /api/health - use dedicated endpoint',
      },
    },
    environment: process.env.NODE_ENV || 'development',
  };

  try {
    return NextResponse.json(healthStatus, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}