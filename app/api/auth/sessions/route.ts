import { NextRequest, NextResponse } from 'next/server';
import { getUserSessions } from '@/lib/session-store';
import { withAuth, AuthUser } from '@/lib/auth';

async function sessionsHandler(request: NextRequest, user: AuthUser) {
  try {
    const sessions = await getUserSessions(user.sub);

    return NextResponse.json({
      success: true,
      data: sessions.map((session) => ({
        id: session.sid,
        uid: session.uid,
        ip: session.ip,
        ua: session.ua,
        createdAt: session.iat,
        expiresAt: session.exp,
      })),
    });
  } catch (error) {
    console.error('Sessions error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(sessionsHandler);