import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import { withAuth, AuthUser } from '@/lib/auth';

const TOOL_CREDITS = {
  generate: 1,
  convert: 2,
  edit: 1,
  translate: 2,
  voice: 3,
  extract: 2,
  merge: 1,
  split: 1,
  compress: 1,
  style: 1,
};

async function widgetHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    const userData = await User.findById(user.sub);
    if (!userData) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    const todayUsage = await CreditTransaction.aggregate([
      {
        $match: {
          userId: user.sub,
          type: 'usage',
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $abs: '$amount' } },
        },
      },
    ]);

    const isPro = userData.role === 'pro';
    const nextReset = new Date();
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);

    return NextResponse.json({
      success: true,
      data: {
        credits: userData.credits || 0,
        usedToday: todayUsage[0]?.total || 0,
        isPro,
        nextResetAt: nextReset,
        toolCosts: TOOL_CREDITS,
        availableTools: Object.keys(TOOL_CREDITS),
      },
      cached: true,
      ttl: 60,
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