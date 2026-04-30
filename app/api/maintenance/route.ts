import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await (await import('@/lib/mongodb')).getMongoDb();
    const config = await db.collection('settings').findOne({ key: 'maintenance' });
    return NextResponse.json({ success: true, data: config?.value || { enabled: false } });
  } catch {
    return NextResponse.json({ success: true, data: { enabled: false } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === 'toggle') {
      const db = await (await import('@/lib/mongodb')).getMongoDb();
      await db.collection('settings').updateOne(
        { key: 'maintenance' },
        { $set: { key: 'maintenance', value: { enabled: body.enabled, message: body.message, clearedAt: body.clearedAt }, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
