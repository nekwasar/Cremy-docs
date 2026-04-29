import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';

const promoValidateSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = promoValidateSchema.parse(body);

    await connectDB();

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promo) {
      return NextResponse.json(
        { error: { message: 'Invalid promo code', code: 'INVALID_CODE' } },
        { status: 400 }
      );
    }

    if (!promo.isActive) {
      return NextResponse.json(
        { error: { message: 'Promo code is no longer active', code: 'CODE_INACTIVE' } },
        { status: 400 }
      );
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json(
        { error: { message: 'Promo code has expired', code: 'CODE_EXPIRED' } },
        { status: 400 }
      );
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json(
        { error: { message: 'Promo code usage limit reached', code: 'CODE_LIMIT_REACHED' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        credits: promo.credits,
        minPurchase: promo.minPurchase,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', details: error.errors, code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Promo validate error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: { message: 'Code required', code: 'CODE_REQUIRED' } },
        { status: 400 }
      );
    }

    await connectDB();

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promo) {
      return NextResponse.json(
        { error: { message: 'Invalid promo code', code: 'INVALID_CODE' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: promo.isActive && (!promo.expiresAt || promo.expiresAt > new Date()),
        credits: promo.credits || 0,
      },
    });
  } catch (error) {
    console.error('Promo check error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}