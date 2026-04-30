import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StorageService } from '@/services/storage';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      const { searchParams } = new URL(request.url);
      const action = searchParams.get('action');

      if (action === 'health') {
        const health = StorageService.getStorageHealth();
        return NextResponse.json({ success: true, data: health });
      }

      return NextResponse.json(
        { success: true, data: { documents: [], settings: {}, templates: [], anonymous: true } }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health':
        return NextResponse.json({
          success: true,
          data: StorageService.getStorageHealth(),
        });
      case 'documents':
        return NextResponse.json({
          success: true,
          data: { documents: StorageService.getDocuments() },
        });
      case 'templates':
        return NextResponse.json({
          success: true,
          data: { templates: StorageService.getTemplates() },
        });
      case 'settings':
        return NextResponse.json({
          success: true,
          data: { settings: StorageService.getSettings() },
        });
      default:
        return NextResponse.json({
          success: true,
          data: {
            initialized: true,
            isAnonymous: false,
            documents: StorageService.getDocuments(),
            settings: StorageService.getSettings(),
            templates: StorageService.getTemplates(),
          },
        });
    }
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'sync_to_cloud':
        if (!session?.user?.id) {
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({
          success: true,
          data: await StorageService.syncToCloud(session.user.id),
        });
      case 'sync_from_cloud':
        if (!session?.user?.id) {
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({
          success: true,
          data: await StorageService.syncFromCloud(session.user.id),
        });
      case 'cleanup':
        StorageService.cleanup();
        return NextResponse.json({ success: true });
      case 'clear':
        StorageService.clear();
        return NextResponse.json({ success: true });
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Storage action error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
