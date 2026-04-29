import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { revokeToken } from '@/lib/token-rotation';

const REFRESH_SECRET = process.env.REFRESH_SECRET || process.env.JWT_SECRET + '-refresh';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET, {
          issuer: 'cremy-docs',
        }) as { jti: string };
        await revokeToken(decoded.jti);
      } catch {
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
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
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}