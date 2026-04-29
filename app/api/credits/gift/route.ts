import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import CreditGift from '@/models/CreditGift';
import { addCredits } from '@/lib/credits';
import { withAuth, AuthUser } from '@/lib/auth';

const GIFT_FEATURE_ENABLED = false;

const giftSchema = z.object({
  amount: z.number().int().positive().min(1).max(1000),
  recipientEmail: z.string().email().optional(),
  message: z.string().max(500).optional(),
});

async function giftHandler(request: NextRequest, user: AuthUser) {
  if (!GIFT_FEATURE_ENABLED) {
    return NextResponse.json(
      { error: { message: 'Gift feature is disabled', code: 'FEATURE_DISABLED' } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = giftSchema.parse(body);

    await connectDB();

    // TODO: Process payment first, then create gift
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const gift = await CreditGift.create({
      senderId: user.sub,
      senderEmail: user.email,
      recipientEmail: validatedData.recipientEmail,
      amount: validatedData.amount,
      message: validatedData.message,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      data: {
        code: gift.code,
        amount: gift.amount,
        expiresAt: gift.expiresAt,
      },
      message: 'Gift code created',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Gift error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(giftHandler);