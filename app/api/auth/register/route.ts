import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { jwtService } from '@/services/jwt';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    await connectDB();

    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: { message: 'Email already registered', code: 'EMAIL_EXISTS' } },
        { status: 400 }
      );
    }

    const user = await User.create({
      email: validatedData.email.toLowerCase(),
      password: validatedData.password,
      name: validatedData.name,
    });

    const verificationToken = jwtService.generateEmailVerificationToken(
      user._id.toString(),
      user.email
    );

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    const response = NextResponse.json(
      {
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
      },
      { status: 201 }
    );

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

    console.error('Register error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}