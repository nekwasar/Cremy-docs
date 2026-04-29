import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getReferralStats } from '@/lib/referral';
import { withAuth, AuthUser } from '@/lib/auth';

async function statsHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    const stats = await getReferralStats(user.sub);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(statsHandler);