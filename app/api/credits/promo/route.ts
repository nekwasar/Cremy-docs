import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';
import { withAuth, AuthUser } from '@/lib/auth';

const validateSchema = z.object({
  code: z.string().min(1),
});

async function validateHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = validateSchema.parse(body);

    await connectDB();

    const promo = await PromoCode.findOne({
      code: validatedData.code.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      return NextResponse.json(
        { error: { message: 'Invalid promo code', code: 'INVALID_CODE' } },
        { status: 400 }
      );
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json(
        { error: { message: 'Promo code expired', code: 'EXPIRED_CODE' } },
        { status: 400 }
      );
    }

    if (promo.usedCount >= promo.maxUses) {
      return NextResponse.json(
        { error: { message: 'Promo code usage limit reached', code: 'CODE_LIMIT_REACHED' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        type: promo.type,
        discount: promo.discount,
        creditAmount: promo.creditAmount,
        minPurchase: promo.minPurchase,
        expiresAt: promo.expiresAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Validate promo error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(validateHandler);