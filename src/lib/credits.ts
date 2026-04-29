import mongoose from 'mongoose';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';

export interface CreditResult {
  success: boolean;
  balance: number;
  message?: string;
}

export interface CreditTransactionInput {
  userId: string;
  type: 'purchase' | 'usage' | 'bonus' | 'refund' | 'admin' | 'referral';
  amount: number;
  description?: string;
  referenceId?: mongoose.Types.ObjectId;
  referenceModel?: 'Document' | 'Subscription' | 'Payment';
  paymentId?: string;
  metadata?: Record<string, any>;
}

export async function getUserCredits(userId: string): Promise<number> {
  const user = await User.findById(userId).select('credits');
  if (!user) {
    throw new Error('User not found');
  }
  return user.credits;
}

export async function checkCredits(userId: string, required: number): Promise<boolean> {
  const balance = await getUserCredits(userId);
  return balance >= required;
}

export async function deductCredits(input: CreditTransactionInput): Promise<CreditResult> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(input.userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.credits < input.amount) {
      return {
        success: false,
        balance: user.credits,
        message: 'Insufficient credits',
      };
    }

    const creditsBefore = user.credits;
    user.credits -= input.amount;
    user.usedCredits += input.amount;
    await user.save({ session });

    await CreditTransaction.create(
      [
        {
          userId: user._id,
          type: input.type,
          amount: -input.amount,
          balance: user.credits,
          creditsBefore,
          creditsAfter: user.credits,
          description: input.description,
          referenceId: input.referenceId,
          referenceModel: input.referenceModel,
          paymentId: input.paymentId,
          metadata: input.metadata,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      balance: user.credits,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function refundCredits(input: CreditTransactionInput): Promise<CreditResult> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(input.userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    const creditsBefore = user.credits;
    user.credits += input.amount;
    await user.save({ session });

    await CreditTransaction.create(
      [
        {
          userId: user._id,
          type: input.type,
          amount: input.amount,
          balance: user.credits,
          creditsBefore,
          creditsAfter: user.credits,
          description: input.description,
          referenceId: input.referenceId,
          referenceModel: input.referenceModel,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      balance: user.credits,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function addCredits(input: CreditTransactionInput): Promise<CreditResult> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(input.userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    const creditsBefore = user.credits;
    user.credits += input.amount;
    await user.save({ session });

    await CreditTransaction.create(
      [
        {
          userId: user._id,
          type: input.type,
          amount: input.amount,
          balance: user.credits,
          creditsBefore,
          creditsAfter: user.credits,
          description: input.description,
          referenceId: input.referenceId,
          referenceModel: input.referenceModel,
          paymentId: input.paymentId,
          metadata: input.metadata,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      balance: user.credits,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export function requireCredits(required: number) {
  return async (userId: string): Promise<void> => {
    const hasCredits = await checkCredits(userId, required);
    if (!hasCredits) {
      throw new Error('INSUFFICIENT_CREDITS');
    }
  };
}