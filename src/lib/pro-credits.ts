import mongoose from 'mongoose';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import CreditTransaction from '@/models/CreditTransaction';
import { addCredits } from './credits';

export const PRO_MONTHLY_CREDITS = 200;
export const PRO_YEARLY_CREDITS = 2400;

export async function allocateProCredits(userId: string, plan: 'monthly' | 'yearly' | 'lifetime'): Promise<{
  allocated: number;
  expiresAt: Date;
}> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const credits = plan === 'yearly' ? PRO_YEARLY_CREDITS : PRO_MONTHLY_CREDITS;
  
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + (plan === 'yearly' ? 12 : 1));

  const result = await addCredits({
    userId,
    type: 'bonus',
    amount: credits,
    description: `Pro subscription (${plan}) credits`,
  });

  return {
    allocated: result.success ? credits : 0,
    expiresAt,
  };
}

export async function processProCreditRollover(userId: string): Promise<number> {
  const user = await User.findById(userId);
  if (!user || (user.role !== 'pro' && user.role !== 'admin')) {
    return 0;
  }

  const subscription = await Subscription.findOne({
    userId,
    status: 'active',
  });

  if (!subscription || subscription.plan === 'lifetime') {
    return 0;
  }

  // Check if it's time for rollover (start of new billing period)
  if (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date()) {
    return 0;
  }

  const MAX_ROLLOVER_CREDITS = 100;
  const rolloverCredits = Math.min(user.credits, MAX_ROLLOVER_CREDITS);

  if (rolloverCredits > 0) {
    await addCredits({
      userId,
      type: 'bonus',
      amount: rolloverCredits,
      description: 'Rollover credits from previous period',
    });
  }

  return rolloverCredits;
}

export async function verifyProStatus(userId: string): Promise<{
  isPro: boolean;
  creditsIncluded: number;
  nextAllocation: Date | null;
}> {
  const subscription = await Subscription.findOne({
    userId,
    status: 'active',
  });

  if (!subscription) {
    return { isPro: false, creditsIncluded: 0, nextAllocation: null };
  }

  const creditsIncluded = subscription.plan === 'yearly' ? PRO_YEARLY_CREDITS : PRO_MONTHLY_CREDITS;
  
  let nextAllocation: Date | null = null;
  if (subscription.currentPeriodEnd) {
    nextAllocation = subscription.currentPeriodEnd;
  }

  return {
    isPro: true,
    creditsIncluded,
    nextAllocation,
  };
}