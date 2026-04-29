import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import { refundCredits } from '@/lib/credits';
import { withAuth, AuthUser } from '@/lib/auth';

const refundSchema = z.object({
  paymentId: z.string(),
  amount: z.number().optional(),
  reason: z.string(),
});

async function refundHandler(request: NextRequest, user: AuthUser) {
  try {
    // Only admins can process refunds
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Admin access required', code: 'UNAUTHORIZED' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = refundSchema.parse(body);

    await connectDB();

    const payment = await Payment.findOne({
      _id: validatedData.paymentId,
      status: 'completed',
    });

    if (!payment) {
      return NextResponse.json(
        { error: { message: 'Payment not found', code: 'PAYMENT_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const refundAmount = validatedData.amount || payment.amount;

    if (refundAmount > payment.amount) {
      return NextResponse.json(
        { error: { message: 'Refund exceeds payment amount', code: 'INVALID_AMOUNT' } },
        { status: 400 }
      );
    }

    // TODO: Process Stripe refund
    // await stripe.refunds.create({...})

    // Update payment status
    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.refundAmount = refundAmount;
    await payment.save();

    // Refund credits to user
    await refundCredits({
      userId: payment.userId.toString(),
      type: 'refund',
      amount: refundAmount,
      description: `Refund: ${validatedData.reason}`,
    });

    return NextResponse.json({
      success: true,
      message: `Refunded ${refundAmount} credits`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Refund error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(refundHandler);