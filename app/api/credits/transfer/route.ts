import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { addCredits, deductCredits } from '@/lib/credits';
import { withAuth, AuthUser } from '@/lib/auth';

const TRANSFER_FEATURE_ENABLED = false;

const transferSchema = z.object({
  recipientEmail: z.string().email(),
  amount: z.number().int().positive().min(1),
});

async function transferHandler(request: NextRequest, user: AuthUser) {
  if (!TRANSFER_FEATURE_ENABLED) {
    return NextResponse.json(
      { error: { message: 'Credit transfer is disabled', code: 'FEATURE_DISABLED' } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = transferSchema.parse(body);

    await connectDB();

    const recipient = await User.findOne({ email: validatedData.recipientEmail.toLowerCase() });
    if (!recipient) {
      return NextResponse.json(
        { error: { message: 'Recipient not found', code: 'RECIPIENT_NOT_FOUND' } },
        { status: 404 }
      );
    }

    if (recipient._id.toString() === user.sub) {
      return NextResponse.json(
        { error: { message: 'Cannot transfer to yourself', code: 'SELF_TRANSFER' } },
        { status: 400 }
      );
    }

    const sender = await User.findById(user.sub);
    if (!sender || sender.credits < validatedData.amount) {
      return NextResponse.json(
        { error: { message: 'Insufficient credits', code: 'INSUFFICIENT_CREDITS' } },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await deductCredits({
        userId: user.sub,
        type: 'admin',
        amount: validatedData.amount,
        description: `Transfer to ${recipient.email}`,
      });

      await addCredits({
        userId: recipient._id.toString(),
        type: 'bonus',
        amount: validatedData.amount,
        description: `Transfer from ${sender.email}`,
      });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return NextResponse.json({
      success: true,
      message: `Transferred ${validatedData.amount} credits to ${recipient.email}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
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