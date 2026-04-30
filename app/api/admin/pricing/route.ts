import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

const DEFAULT_PRICING = {
  generation: { perWords: 100, cost: 1 },
  editing: { perEdits: 10, cost: 1 },
  translation: { perWords: 50, cost: 1 },
  summarize: { perWords: 100, cost: 1 },
  formatCosts: {},
  bundles: [
    { credits: 100, price: 10 },
    { credits: 500, price: 40 },
    { credits: 1000, price: 70 },
  ],
  proMonthly: 9,
  proYearly: 86,
  proCredits: 200,
};

export async function GET() {
  try {
    const db = await getMongoDb();
    const config = await db.collection('settings').findOne({ key: 'pricing' });
    return NextResponse.json({ success: true, data: config?.value || DEFAULT_PRICING });
  } catch {
    return NextResponse.json({ success: true, data: DEFAULT_PRICING });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getMongoDb();
    await db.collection('settings').updateOne(
      { key: 'pricing' },
      { $set: { key: 'pricing', value: body, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
