import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RefreshToken from '@/models/RefreshToken';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      await connectDB();
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { isRevoked: true, revokedAt: new Date() }
      );
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