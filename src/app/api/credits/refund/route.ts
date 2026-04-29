import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import Payment from '@/models/Payment';

const refundSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID required'),
  amount: z.number().int().positive().optional(),
  reason: z.string().min(1, 'Reason required'),
});

async function refundHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = refundSchema.parse(body);

    await connectDB();

    const payment = await Payment.findById(validatedData.paymentId);
    if (!payment) {
      return NextResponse.json(
        { error: { message: 'Payment not found', code: 'PAYMENT_NOT_FOUND' } },
        { status: 404 }
      );
    }

    if (payment.status !== 'completed') {
      return NextResponse.json(
        { error: { message: 'Payment not completed', code: 'INVALID_PAYMENT' } },
        { status: 400 }
      );
    }

    const refundAmount = validatedData.amount || payment.amount;

    if (refundAmount > payment.amount) {
      return NextResponse.json(
        { error: { message: 'Refund amount exceeds payment', code: 'INVALID_AMOUNT' } },
        { status: 400 }
      );
    }

    const user = await User.findById(payment.userId);
    if (!user) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const previousCredits = user.credits || 0;
    const newCredits = Math.max(0, previousCredits - refundAmount);

    await User.findByIdAndUpdate(payment.userId, { credits: newCredits });

    await Payment.findByIdAndUpdate(payment._id, {
      status: 'refunded',
      refundedAt: new Date(),
      refundAmount,
    });

    await CreditTransaction.create({
      userId: payment.userId,
      type: 'refund',
      amount: -refundAmount,
      balance: newCredits,
      description: `Refund: ${validatedData.reason}`,
      creditsBefore: previousCredits,
      creditsAfter: newCredits,
      metadata: { paymentId: payment._id, refundAmount },
    });

    return NextResponse.json({
      success: true,
      data: {
        refundAmount,
        userCredits: newCredits,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', details: error.errors, code: 'VALIDATION_ERROR' } },
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

export const POST = refundHandler;