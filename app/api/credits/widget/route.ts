import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, AuthUser } from '@/lib/auth';

async function widgetHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    const dbUser = await User.findById(user.sub).select('credits usedCredits role');
    if (!dbUser) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const isPro = dbUser.role === 'pro' || dbUser.role === 'admin';
    const credits = dbUser.credits;
    const usedCredits = dbUser.usedCredits;
    const totalCredits = credits + usedCredits;

    return NextResponse.json({
      success: true,
      data: {
        available: credits,
        used: usedCredits,
        total: totalCredits,
        isPro,
        tier: dbUser.role,
      },
    });
  } catch (error) {
    console.error('Widget error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(widgetHandler);