import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyRefreshToken, rotateRefreshToken } from '@/lib/token-rotation';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: { message: 'Refresh token not found', code: 'NO_REFRESH_TOKEN' } },
        { status: 401 }
      );
    }

    const tokenData = await verifyRefreshToken(refreshToken);
    if (!tokenData) {
      return NextResponse.json(
        { error: { message: 'Invalid or expired refresh token', code: 'INVALID_TOKEN' } },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(tokenData.uid);
    if (!user) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 401 }
      );
    }

    const result = await rotateRefreshToken(refreshToken);
    if (!result) {
      return NextResponse.json(
        { error: { message: 'Token rotation failed', code: 'ROTATION_FAILED' } },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken: result.accessToken,
      },
    });

    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: { message: 'Invalid refresh token', code: 'INVALID_TOKEN' } },
      { status: 401 }
    );
  }
}