import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { jwtService } from '@/services/jwt';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: { message: 'Refresh token not found', code: 'NO_REFRESH_TOKEN' } },
        { status: 401 }
      );
    }

    await connectDB();

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: { message: 'Invalid or expired refresh token', code: 'INVALID_TOKEN' } },
        { status: 401 }
      );
    }

    const payload = jwtService.verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.sub);
    if (!user) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 401 }
      );
    }

    const newPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    const accessToken = jwtService.generateAccessToken(newPayload);
    const newRefreshToken = jwtService.generateRefreshToken(newPayload);

    await RefreshToken.findByIdAndUpdate(storedToken._id, {
      isRevoked: true,
      revokedAt: new Date(),
    });

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
        accessToken,
      },
    });

    response.cookies.set('refreshToken', newRefreshToken, {
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