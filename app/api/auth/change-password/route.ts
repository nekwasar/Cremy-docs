import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { withAuth, AuthUser } from '@/lib/auth';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

async function changePasswordHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    await connectDB();

    const dbUser = await User.findById(user.sub).select('+password');
    if (!dbUser) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const isPasswordValid = await dbUser.comparePassword(validatedData.currentPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: { message: 'Current password is incorrect', code: 'INVALID_PASSWORD' } },
        { status: 400 }
      );
    }

    dbUser.password = validatedData.newPassword;
    await dbUser.save();

    await RefreshToken.updateMany(
      { userId: dbUser._id, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Password changed successfully',
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Change password error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(changePasswordHandler);