import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, AuthUser } from '@/lib/auth';

async function getBalanceHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    const userData = await User.findById(user.sub);
    if (!userData) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const transactions = await import('@/models/CreditTransaction');
    const usageHistory = await transactions.default
      .find({ userId: user.sub, type: 'usage' })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('amount createdAt description');

    const bonusHistory = await transactions.default
      .find({ userId: user.sub, type: 'bonus' })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('amount createdAt description');

    return NextResponse.json({
      success: true,
      data: {
        credits: userData.credits || 0,
        usedCredits: userData.usedCredits || 0,
        proCredits: userData.proCredits || 0,
        proCreditsExpires: userData.proCreditsExpires,
        subscription: userData.role,
        usageHistory: usageHistory.map((t) => ({
          amount: t.amount,
          description: t.description,
          createdAt: t.createdAt,
        })),
        bonusHistory: bonusHistory.map((t) => ({
          amount: t.amount,
          description: t.description,
          createdAt: t.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Balance error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getBalanceHandler);