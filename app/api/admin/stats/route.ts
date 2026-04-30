import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getMongoDb();

    const [totalUsers, totalDocuments] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('documents').countDocuments(),
    ]);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const activeUsers = await db.collection('users').countDocuments({
      lastLoginAt: { $gte: monthStart },
    });

    return NextResponse.json({
      success: true,
      data: { totalUsers, totalDocuments, totalRevenue: 0, activeUsers },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
