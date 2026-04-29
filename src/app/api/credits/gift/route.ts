import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';
import { withAuth, AuthUser } from '@/lib/auth';

const giftSchema = z.object({
  amount: z.number().int().positive('Amount must be positive').min(10, 'Minimum gift is 10 credits'),
  recipientEmail: z.string().email('Invalid email address').optional(),
  message: z.string().max(500).optional(),
});

async function giftHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = giftSchema.parse(body);

    await connectDB();

    const giftCode = `GIFT-${uuidv4().substring(0, 8).toUpperCase()}`;

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await PromoCode.create({
      code: giftCode,
      type: 'package',
      discount: 0,
      creditAmount: validatedData.amount,
      maxUses: 1,
      usedCount: 0,
      expiresAt,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        giftCode,
        amount: validatedData.amount,
        expiresAt,
        message: validatedData.message || 'Gift credits from a friend!',
        redemptionUrl: `/credits/redeem?code=${giftCode}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', details: error.errors, code: 'VALIDATION_ERROR' } },
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