import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { withAuth, AuthUser } from '@/lib/auth';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

async function deleteAccountHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = deleteAccountSchema.parse(body);

    await connectDB();

    const dbUser = await User.findById(user.sub).select('+password');
    if (!dbUser) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const isPasswordValid = await dbUser.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: { message: 'Incorrect password', code: 'INVALID_PASSWORD' } },
        { status: 400 }
      );
    }

    await RefreshToken.deleteMany({ userId: user.sub });
    await User.findByIdAndDelete(user.sub);

    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
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

    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const DELETE = withAuth(deleteAccountHandler);