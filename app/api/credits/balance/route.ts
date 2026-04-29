import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, AuthUser } from '@/lib/auth';

async function balanceHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    const dbUser = await User.findById(user.sub).select('credits usedCredits');
    if (!dbUser) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        available: dbUser.credits,
        used: dbUser.usedCredits,
        total: dbUser.credits + dbUser.usedCredits,
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(balanceHandler);