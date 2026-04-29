import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';
import CreditTransaction from '@/models/CreditTransaction';
import User from '@/models/User';

const CREDIT_PACKAGES = [
  { id: 'starter', credits: 10, price: 9.99, bonus: 0 },
  { id: 'basic', credits: 50, price: 39.99, bonus: 5 },
  { id: 'pro', credits: 100, price: 69.99, bonus: 15 },
  { id: 'business', credits: 500, price: 299.99, bonus: 100 },
  { id: 'enterprise', credits: 1000, price: 499.99, bonus: 250 },
];

export async function getCreditPackages() {
  return CREDIT_PACKAGES;
}

export async function getPackagePrice(packageId: string): Promise<{ credits: number; price: number; bonus: number } | null> {
  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) return null;
  return { credits: pkg.credits, price: pkg.price, bonus: pkg.bonus };
}

export async function calculateTotal(credits: number, promoCode?: string): Promise<{ subtotal: number; discount: number; total: number }> {
  const pricePerCredit = credits >= 1000 ? 0.5 : credits >= 500 ? 0.6 : credits >= 100 ? 0.7 : credits >= 50 ? 0.8 : 0.99;
  const subtotal = credits * pricePerCredit;

  let discount = 0;
  if (promoCode) {
    const code = await PromoCode.findOne({ code: promoCode, isActive: true });
    if (code) {
      if (code.discountType === 'percentage') {
        discount = subtotal * (code.discountValue / 100);
      } else {
        discount = code.discountValue;
      }
    }
  }

  return { subtotal, discount, total: Math.max(0, subtotal - discount) };
}

const purchaseSchema = z.object({
  packageId: z.enum(['starter', 'basic', 'pro', 'business', 'enterprise']),
  paymentMethodId: z.string().optional(),
  promoCode: z.string().optional(),
});

async function purchaseHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = purchaseSchema.parse(body);

    await connectDB();

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: { message: 'Authentication required', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      );
    }

    const packageInfo = CREDIT_PACKAGES.find((p) => p.id === validatedData.packageId);
    if (!packageInfo) {
      return NextResponse.json(
        { error: { message: 'Invalid package', code: 'INVALID_PACKAGE' } },
        { status: 400 }
      );
    }

    const { total } = await calculateTotal(packageInfo.credits + packageInfo.bonus, validatedData.promoCode);

    if (validatedData.promoCode) {
      await PromoCode.findOneAndUpdate(
        { code: validatedData.promoCode },
        { $inc: { usageCount: 1 } }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const previousCredits = user.credits || 0;
    const totalCredits = packageInfo.credits + packageInfo.bonus;
    const newCredits = previousCredits + totalCredits;

    await User.findByIdAndUpdate(userId, { credits: newCredits });

    await CreditTransaction.create({
      userId,
      type: 'purchase',
      amount: totalCredits,
      balance: newCredits,
      description: `${packageInfo.id} package - ${totalCredits} credits`,
      creditsBefore: previousCredits,
      creditsAfter: newCredits,
      metadata: {
        packageId: packageInfo.id,
        price: total,
        promoCode: validatedData.promoCode,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        credits: totalCredits,
        balance: newCredits,
        price: total,
      },
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = purchaseHandler;