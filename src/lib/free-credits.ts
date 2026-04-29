import mongoose from 'mongoose';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';

const FREE_CREDITS_DAILY = 3;
const FREE_CREDITS_MAX = 10;

export interface FreeCreditsResult {
  added: number;
  dailyLimit: number;
  maxAccumulation: number;
  resetAt: Date;
}

export async function allocateFreeCredits(userId: string): Promise<FreeCreditsResult> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'pro' || user.role === 'admin') {
    return {
      added: 0,
      dailyLimit: -1,
      maxAccumulation: -1,
      resetAt: new Date(),
    };
  }

  const now = new Date();
  const lastReset = user.lastCreditResetAt || new Date(0);
  const isNewDay = now.getDate() !== lastReset.getDate() || 
                   now.getMonth() !== lastReset.getMonth() ||
                   now.getFullYear() !== lastReset.getFullYear();

  if (isNewDay) {
    const creditsToAdd = Math.min(FREE_CREDITS_DAILY, FREE_CREDITS_MAX - user.credits);
    
    if (creditsToAdd > 0) {
      user.credits += creditsToAdd;
      user.lastCreditResetAt = now;
      await user.save();

      await CreditTransaction.create({
        userId: user._id,
        type: 'bonus',
        amount: creditsToAdd,
        balance: user.credits,
        creditsBefore: user.credits - creditsToAdd,
        creditsAfter: user.credits,
        description: 'Daily free credits',
      });
    }

    const nextReset = new Date(now);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);

    return {
      added: creditsToAdd,
      dailyLimit: FREE_CREDITS_DAILY,
      maxAccumulation: FREE_CREDITS_MAX,
      resetAt: nextReset,
    };
  }

  const nextReset = new Date(lastReset);
  nextReset.setDate(nextReset.getDate() + 1);
  nextReset.setHours(0, 0, 0, 0);

  return {
    added: 0,
    dailyLimit: FREE_CREDITS_DAILY,
    maxAccumulation: FREE_CREDITS_MAX,
    resetAt: nextReset,
  };
}

export async function getFreeCreditsStatus(userId: string): Promise<{
  available: number;
  usedToday: number;
  dailyLimit: number;
  maxAccumulation: number;
  resetAt: Date;
  isPro: boolean;
}> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'pro' || user.role === 'admin') {
    return {
      available: -1,
      usedToday: 0,
      dailyLimit: -1,
      maxAccumulation: -1,
      resetAt: new Date(),
      isPro: true,
    };
  }

  const now = new Date();
  const lastReset = user.lastCreditResetAt || new Date(0);
  const isNewDay = now.getDate() !== lastReset.getDate() || 
                   now.getMonth() !== lastReset.getMonth() ||
                   now.getFullYear() !== lastReset.getFullYear();

  const usedToday = isNewDay ? 0 : Math.max(0, FREE_CREDITS_DAILY - (user.credits % FREE_CREDITS_DAILY));
  
  const nextReset = new Date(lastReset);
  nextReset.setDate(nextReset.getDate() + 1);
  nextReset.setHours(0, 0, 0, 0);

  return {
    available: user.credits,
    usedToday,
    dailyLimit: FREE_CREDITS_DAILY,
    maxAccumulation: FREE_CREDITS_MAX,
    resetAt: nextReset,
    isPro: false,
  };
}