import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import CreditGift from '@/models/CreditGift';
import { addCredits } from '@/lib/credits';
import { withAuth, AuthUser } from '@/lib/auth';

const redeemSchema = z.object({
  code: z.string().min(8).max(20),
});

async function redeemHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = redeemSchema.parse(body);

    await connectDB();

    const gift = await CreditGift.findOne({ code: validatedData.code.toUpperCase() });

    if (!gift) {
      return NextResponse.json(
        { error: { message: 'Invalid gift code', code: 'INVALID_CODE' } },
        { status: 400 }
      );
    }

    if (gift.isRedeemed) {
      return NextResponse.json(
        { error: { message: 'Gift code already redeemed', code: 'ALREADY_REDEEMED' } },
        { status: 400 }
      );
    }

    if (gift.expiresAt < new Date()) {
      return NextResponse.json(
        { error: { message: 'Gift code expired', code: 'EXPIRED_CODE' } },
        { status: 400 }
      );
    }

    await addCredits({
      userId: user.sub,
      type: 'bonus',
      amount: gift.amount,
      description: `Gift code redeemed: ${gift.code}`,
    });

    gift.isRedeemed = true;
    gift.redeemedBy = user.sub as any;
    gift.redeemedAt = new Date();
    await gift.save();

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed ${gift.amount} credits`,
      data: {
        amount: gift.amount,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Redeem error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(redeemHandler);