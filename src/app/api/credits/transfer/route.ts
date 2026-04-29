import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import { withAuth, AuthUser } from '@/lib/auth';

const transferSchema = z.object({
  recipientEmail: z.string().email('Invalid email address'),
  amount: z.number().int().positive('Amount must be positive').min(1, 'Minimum transfer is 1 credit'),
});

async function transferHandler(request: NextRequest, user: AuthUser) {
  try {
    const body = await request.json();
    const validatedData = transferSchema.parse(body);

    await connectDB();

    if (user.email.toLowerCase() === validatedData.recipientEmail.toLowerCase()) {
      return NextResponse.json(
        { error: { message: 'Cannot transfer credits to yourself', code: 'INVALID_RECIPIENT' } },
        { status: 400 }
      );
    }

    const sender = await User.findById(user.sub);
    if (!sender) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    if ((sender.credits || 0) < validatedData.amount) {
      return NextResponse.json(
        { error: { message: 'Insufficient credits', code: 'INSUFFICIENT_CREDITS' } },
        { status: 400 }
      );
    }

    const recipient = await User.findOne({ email: validatedData.recipientEmail.toLowerCase() });
    if (!recipient) {
      return NextResponse.json(
        { error: { message: 'Recipient not found', code: 'RECIPIENT_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const senderCredits = sender.credits || 0;
    const recipientCredits = recipient.credits || 0;
    const newSenderCredits = senderCredits - validatedData.amount;
    const newRecipientCredits = recipientCredits + validatedData.amount;

    await User.findByIdAndUpdate(user.sub, { credits: newSenderCredits });
    await User.findByIdAndUpdate(recipient._id, { credits: newRecipientCredits });

    await CreditTransaction.create({
      userId: user.sub,
      type: 'usage',
      amount: -validatedData.amount,
      balance: newSenderCredits,
      description: `Transfer to ${recipient.email}`,
      creditsBefore: senderCredits,
      creditsAfter: newSenderCredits,
    });

    await CreditTransaction.create({
      userId: recipient._id,
      type: 'bonus',
      amount: validatedData.amount,
      balance: newRecipientCredits,
      description: `Transfer from ${sender.email}`,
      creditsBefore: recipientCredits,
      creditsAfter: newRecipientCredits,
    });

    return NextResponse.json({
      success: true,
      data: {
        amountTransferred: validatedData.amount,
        senderBalance: newSenderCredits,
        recipientEmail: recipient.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', details: error.errors, code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(transferHandler);