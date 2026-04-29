import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { jwtService } from '@/services/jwt';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    await connectDB();

    const user = await User.findOne({ email: validatedData.email.toLowerCase() }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' } },
        { status: 401 }
      );
    }

    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' } },
        { status: 401 }
      );
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
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

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', details: error.errors, code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}