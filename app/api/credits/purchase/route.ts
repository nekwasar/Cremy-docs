import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import { addCredits } from '@/lib/credits';
import { creditPackages, getPackageById } from '@/config/credits';
import { withAuth, AuthUser } from '@/lib/auth';

const purchaseSchema = z.object({
  packageId: z.string(),
  promoCode: z.string().optional(),
});

async function purchaseHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = purchaseSchema.parse(body);

    const pkg = getPackageById(validatedData.packageId);
    if (!pkg) {
      return NextResponse.json(
        { error: { message: 'Invalid package', code: 'INVALID_PACKAGE' } },
        { status: 400 }
      );
    }

    const totalCredits = pkg.credits + pkg.bonusCredits;
    
    // TODO: Integrate Stripe payment
    // For now, simulate successful purchase
    // In production, create Stripe PaymentIntent and confirm payment
    
    await addCredits({
      userId: user.sub,
      type: 'purchase',
      amount: totalCredits,
      description: `Purchased ${pkg.credits} credits${pkg.bonusCredits > 0 ? ` + ${pkg.bonusCredits} bonus` : ''}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        credits: totalCredits,
        package: pkg,
      },
      message: 'Credits purchased successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(purchaseHandler);

// Available packages endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    data: creditPackages,
  });
}