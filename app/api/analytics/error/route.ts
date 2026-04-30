import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getMongoDb();

    await db.collection('error_logs').insertOne({
      type: body.type || 'unknown',
      message: body.message,
      stack: body.stack,
      componentStack: body.componentStack,
      timestamp: new Date(body.timestamp || Date.now()),
      userAgent: request.headers.get('user-agent') || '',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
