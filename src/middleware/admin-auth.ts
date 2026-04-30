import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getMongoDb } from '@/lib/mongodb';

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const session = await getServerSession();
  const user = session?.user as any;

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getMongoDb();
  const dbUser = await db.collection('users').findOne({ _id: user.id });

  if (!dbUser || dbUser.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
