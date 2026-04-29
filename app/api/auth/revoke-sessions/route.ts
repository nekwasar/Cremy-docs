import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RefreshToken from '@/models/RefreshToken';
import { withAuth, AuthUser } from '@/lib/auth';

async function revokeSessionsHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    await RefreshToken.updateMany(
      { userId: user.sub, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() }
    );

    const response = NextResponse.json({
      success: true,
      message: 'All sessions revoked',
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Revoke sessions error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(revokeSessionsHandler);