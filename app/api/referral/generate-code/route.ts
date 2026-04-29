import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { generateReferralCode } from '@/lib/referral';
import { withAuth, AuthUser } from '@/lib/auth';

async function generateCodeHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    const result = await generateReferralCode(user.sub);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Generate referral code error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(generateCodeHandler);