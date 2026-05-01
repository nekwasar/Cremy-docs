import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, AuthUser } from '@/lib/auth';

async function meHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    const dbUser = await User.findById(user.sub);
    if (!dbUser) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: dbUser._id,
        email: dbUser.email,
        name: dbUser.name,
        avatar: dbUser.avatar,
        role: dbUser.role,
        isEmailVerified: dbUser.isEmailVerified,
        credits: dbUser.credits,
        usedCredits: dbUser.usedCredits,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(meHandler);