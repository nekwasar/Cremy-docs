import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

const DEFAULT_SETTINGS = {
  anonymousCredits: 5,
  registeredCredits: 10,
  genPerWords: 100,
  editPerEdits: 10,
  translatePerWords: 50,
  ocrPerWords: 50,
  stylePerWords: 100,
  imageCost: 1,
  creditPacks: [
    { credits: 100, price: 10 },
    { credits: 500, price: 40 },
  ],
  maintenanceMode: false,
  maintenanceDays: 7,
  maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
  registrationOpen: true,
  registrationClosedMessage: 'Registration is temporarily closed. Please check back later.',
};

export async function GET() {
  try {
    const db = await getMongoDb();
    const config = await db.collection('settings').findOne({ key: 'system' });
    return NextResponse.json({ success: true, data: config?.value || DEFAULT_SETTINGS });
  } catch {
    return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getMongoDb();
    await db.collection('settings').updateOne(
      { key: 'system' },
      { $set: { key: 'system', value: body, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
