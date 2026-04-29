import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMongoDb } from '@/lib/mongodb';
import { migrateLocalToMongo, migrateMongoToLocal } from '@/services/data-migration';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getMongoDb();
    
    const settings = await db.collection('user_settings').findOne({
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: {
        storageEnabled: settings?.storageEnabled ?? false,
        storageType: settings?.storageType ?? 'local',
      },
    });
  } catch (error) {
    console.error('Storage settings error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { enabled, localData } = body;

    const db = await getMongoDb();

    if (enabled && localData) {
      const result = await migrateLocalToMongo(session.user.id, localData);
      
      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: 'Migration failed',
          data: result,
        }, { status: 500 });
      }
    }

    await db.collection('user_settings').updateOne(
      { userId: session.user.id },
      {
        $set: {
          userId: session.user.id,
          storageEnabled: enabled,
          storageType: enabled ? 'mongodb' : 'local',
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        storageEnabled: enabled,
      },
    });
  } catch (error) {
    console.error('Storage toggle error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}