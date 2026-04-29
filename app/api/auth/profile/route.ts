import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, AuthUser } from '@/lib/auth';

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url().optional(),
});

async function profileHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    await connectDB();

    const dbUser = await User.findById(user.sub);
    if (!dbUser) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    if (validatedData.name) {
      dbUser.name = validatedData.name;
    }
    if (validatedData.avatar !== undefined) {
      dbUser.avatar = validatedData.avatar;
    }

    await dbUser.save();

    return NextResponse.json({
      success: true,
      data: {
        id: dbUser._id,
        email: dbUser.email,
        name: dbUser.name,
        avatar: dbUser.avatar,
        role: dbUser.role,
        isEmailVerified: dbUser.isEmailVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(profileHandler);