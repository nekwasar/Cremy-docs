import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RefreshToken from '@/models/RefreshToken';
import { withAuth, AuthUser } from '@/lib/auth';

async function sessionsHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    const sessions = await RefreshToken.find({ userId: user.sub })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-token');

    return NextResponse.json({
      success: true,
      data: sessions.map((session) => ({
        id: session._id,
        isRevoked: session.isRevoked,
        revokedAt: session.revokedAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
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