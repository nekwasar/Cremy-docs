import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';
import { randomBytes } from 'crypto';

export async function GET() {
  try {
    const db = await getMongoDb();
    const key = await db.collection('api_keys').findOne({ isActive: true });

    if (!key) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({
      success: true,
      data: {
        key: key.key,
        masked: `${key.key?.slice(0, 8)}${'*'.repeat(24)}`,
        stats: {
          requestsToday: key.requestsToday || 0,
          requestsMonth: key.requestsMonth || 0,
          lastUsed: key.lastUsed || '',
          status: key.isActive ? 'Active' : 'Inactive',
        },
      },
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST() {
  try {
    const db = await getMongoDb();
    const newKey = `sk-${randomBytes(32).toString('hex')}`;

    await db.collection('api_keys').insertOne({
      key: newKey,
      prefix: newKey.slice(0, 11),
      isActive: true,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: { key: newKey } });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const db = await getMongoDb();
    await db.collection('api_keys').deleteMany({});
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
