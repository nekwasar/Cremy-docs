import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getVersions, restoreVersion } from '@/lib/versions';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const versions = await getVersions(id, session.user.id);

    return NextResponse.json({
      success: true,
      data: { versions },
    });
  } catch (error) {
    console.error('Get versions error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get versions' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { success: false, error: 'Missing versionId' },
        { status: 400 }
      );
    }

    const document = await restoreVersion(id, versionId, session.user.id);
    
    if (!document) {
      return NextResponse.json({ success: false, error: 'Version not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { document },
    });
  } catch (error) {
    console.error('Restore version error:', error);
    return NextResponse.json({ success: false, error: 'Failed to restore version' }, { status: 500 });
  }
}