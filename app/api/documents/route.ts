import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listDocuments } from '@/lib/document-save';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const { documents, total } = await listDocuments(session.user.id, page, limit);

    return NextResponse.json({
      success: true,
      data: { documents, total, page, limit },
    });
  } catch (error) {
    console.error('List documents error:', error);
    return NextResponse.json({ success: false, error: 'Failed to list documents' }, { status: 500 });
  }
}