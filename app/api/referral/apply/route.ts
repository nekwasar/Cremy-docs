import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateReferralCode, applyReferral } from '@/lib/referral';
import { withAuth, AuthUser } from '@/lib/auth';

const applySchema = z.object({
  referralCode: z.string().min(8),
});

async function applyHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = applySchema.parse(body);

    await connectDB();

    const referrer = await User.findOne({ 
      email: { $regex: new RegExp(validatedData.referralCode, 'i') } 
    });
    
    if (!referrer) {
      return NextResponse.json(
        { error: { message: 'Invalid referral code', code: 'INVALID_CODE' } },
        { status: 400 }
      );
    }

    const result = await applyReferral(
      referrer._id.toString(),
      user.sub
    );

    if (!result) {
      return NextResponse.json(
        { error: { message: 'Referral could not be applied', code: 'REFERRAL_FAILED' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Referral applied successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Apply referral error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(applyHandler);