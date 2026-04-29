import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';

const FREE_CREDIT_DAILY = 3;
const FREE_CREDIT_MAX = 10;

export async function allocateFreeCredits(userId: string): Promise<{ creditsAdded: number; newBalance: number }> {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.role === 'pro') {
    return { creditsAdded: 0, newBalance: user.credits || 0 };
  }

  const lastReset = user.lastCreditResetAt || new Date(0);
  const now = new Date();
  const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceReset < 1) {
    return { creditsAdded: 0, newBalance: user.credits || 0 };
  }

  const currentCredits = user.credits || 0;
  const availableCredits = Math.min(FREE_CREDIT_MAX - currentCredits, FREE_CREDIT_DAILY);

  if (availableCredits <= 0) {
    return { creditsAdded: 0, newBalance: currentCredits };
  }

  const newBalance = currentCredits + availableCredits;

  await User.findByIdAndUpdate(userId, {
    credits: newBalance,
    lastCreditResetAt: now,
  });

  await CreditTransaction.create({
    userId,
    type: 'bonus',
    amount: availableCredits,
    balance: newBalance,
    description: 'Daily free credits',
    creditsBefore: currentCredits,
    creditsAfter: newBalance,
  });

  return { creditsAdded: availableCredits, newBalance };
}

export async function getFreeCreditsStatus(userId: string): Promise<{ dailyCredits: number; maxCredits: number; nextReset: Date | null }> {
  await connectDB();

  const user = await User.findById(userId);
  if (!user || user.role === 'pro') {
    return { dailyCredits: 0, maxCredits: 0, nextReset: null };
  }

  const lastReset = user.lastCreditResetAt || new Date(0);
  const now = new Date();
  const nextReset = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000);

  return {
    dailyCredits: FREE_CREDIT_DAILY,
    maxCredits: FREE_CREDIT_MAX,
    nextReset: nextReset > now ? nextReset : null,
  };
}

export async function hasFreeCreditsAvailable(userId: string): Promise<boolean> {
  const status = await getFreeCreditsStatus(userId);
  return status.maxCredits > 0;
}