import { getMongoDb } from '@/lib/mongodb';

interface CreditCheckResult {
  allowed: boolean;
  remainingCredits: number;
  estimatedCost: number;
  canComplete: boolean;
  warningLevel: 'none' | 'low' | 'critical';
  message?: string;
  action?: 'continue' | 'block' | 'warn';
}

export async function checkCreditsBeforeAction(
  userId: string,
  estimatedCost: number
): Promise<CreditCheckResult> {
  const db = await getMongoDb();
  const user = await db.collection('users').findOne({ _id: userId });

  if (!user) {
    return {
      allowed: false,
      remainingCredits: 0,
      estimatedCost,
      canComplete: false,
      warningLevel: 'critical',
      message: 'User account not found.',
      action: 'block',
    };
  }

  const remainingCredits = user.credits || 0;
  const isPro = user.role === 'pro';

  if (isPro) {
    return {
      allowed: true,
      remainingCredits: Infinity,
      estimatedCost: 0,
      canComplete: true,
      warningLevel: 'none',
      action: 'continue',
    };
  }

  if (remainingCredits <= 0 && estimatedCost > 0) {
    return {
      allowed: false,
      remainingCredits: 0,
      estimatedCost,
      canComplete: false,
      warningLevel: 'critical',
      message: 'You have no credits remaining. Please purchase credits to continue.',
      action: 'block',
    };
  }

  if (remainingCredits < estimatedCost && remainingCredits > 0) {
    return {
      allowed: true,
      remainingCredits,
      estimatedCost,
      canComplete: true,
      warningLevel: 'critical',
      message: `You only have ${remainingCredits} credits, but this action needs ${estimatedCost}. You can complete this action, but will run out of credits.`,
      action: 'warn',
    };
  }

  if (remainingCredits <= 5) {
    return {
      allowed: true,
      remainingCredits,
      estimatedCost,
      canComplete: true,
      warningLevel: 'low',
      message: `You have ${remainingCredits} credits remaining. Consider purchasing more.`,
      action: 'warn',
    };
  }

  if (remainingCredits <= estimatedCost * 1.5) {
    return {
      allowed: true,
      remainingCredits,
      estimatedCost,
      canComplete: true,
      warningLevel: 'low',
      message: 'You are running low on credits.',
      action: 'warn',
    };
  }

  return {
    allowed: true,
    remainingCredits,
    estimatedCost,
    canComplete: true,
    warningLevel: 'none',
    action: 'continue',
  };
}

export async function handleMidGenerationCreditExhaustion(
  userId: string,
  wordCountGenerated: number
): Promise<{
  shouldStop: boolean;
  creditsLeft: number;
  message: string;
}> {
  const db = await getMongoDb();
  const user = await db.collection('users').findOne({ _id: userId });

  if (!user) {
    return { shouldStop: true, creditsLeft: 0, message: 'User not found. Generation stopped.' };
  }

  if (user.role === 'pro') {
    return { shouldStop: false, creditsLeft: Infinity, message: '' };
  }

  if (user.credits <= 0) {
    await db.collection('notifications').insertOne({
      userId,
      type: 'credits_exhausted',
      title: 'Credits Exhausted',
      message: 'Your credits have been completely used. Purchase more to continue generating documents.',
      isRead: false,
      createdAt: new Date(),
    });

    return {
      shouldStop: true,
      creditsLeft: 0,
      message: 'Credits exhausted during generation. Your document was partially saved. Purchase credits to continue.',
    };
  }

  return { shouldStop: false, creditsLeft: user.credits, message: '' };
}

export async function handleProSubscriptionExpiry(userId: string): Promise<void> {
  const db = await getMongoDb();
  const sub = await db.collection('subscriptions').findOne({ userId, status: 'active' });

  if (sub) {
    const now = new Date();
    const periodEnd = new Date(sub.currentPeriodEnd);

    if (now > periodEnd) {
      await db.collection('subscriptions').updateOne(
        { _id: sub._id },
        { $set: { status: 'expired', updatedAt: now } }
      );

      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { role: 'free' } }
      );

      await db.collection('notifications').insertOne({
        userId,
        type: 'subscription_expired',
        title: 'Pro Subscription Expired',
        message: 'Your Pro subscription has expired. Your documents are still saved. Renew to restore Pro features.',
        isRead: false,
        createdAt: now,
      });
    }
  }
}

export async function processRefundRequest(
  userId: string,
  transactionId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getMongoDb();

    const transaction = await db.collection('credit_transactions').findOne({
      userId,
      referenceId: transactionId,
    });

    if (!transaction) {
      return { success: false, message: 'Transaction not found.' };
    }

    const thirtySecondsAgo = Date.now() - 30000;
    if (new Date(transaction.createdAt).getTime() < thirtySecondsAgo) {
      return {
        success: false,
        message: 'Refund window has expired. Refunds are only available within 30 seconds of the transaction.',
      };
    }

    const refundAmount = Math.abs(transaction.amount);
    await db.collection('users').updateOne(
      { _id: userId },
      { $inc: { credits: refundAmount } }
    );

    await db.collection('credit_transactions').insertOne({
      userId,
      type: 'refund',
      amount: refundAmount,
      description: `Refund for transaction ${transactionId}: ${reason}`,
      referenceId: transactionId,
      balance: 0,
      createdAt: new Date(),
    });

    return { success: true, message: `${refundAmount} credits refunded to your account.` };
  } catch {
    return { success: false, message: 'Refund processing failed. Please contact support.' };
  }
}
