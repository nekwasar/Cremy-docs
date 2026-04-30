import { NextRequest, NextResponse } from 'next/server';
import { createAdminFromToken } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, username, password } = body;

    if (!token || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await createAdminFromToken(token, username, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}
