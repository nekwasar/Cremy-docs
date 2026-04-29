import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import { addCredits } from '@/lib/credits';

export const SIGNUP_REWARD_CREDITS = 10;

export async function grantSignupReward(userId: string): Promise<{
  success: boolean;
  creditsAwarded: number;
  message?: string;
}> {
  const user = await User.findById(userId);
  
  if (!user) {
    return { success: false, creditsAwarded: 0, message: 'User not found' };
  }

  const hasReceivedReward = await CreditTransaction.findOne({
    userId,
    type: 'bonus',
    description: 'Signup reward',
  });

  if (hasReceivedReward) {
    return { success: false, creditsAwarded: 0, message: 'Reward already claimed' };
  }

  const result = await addCredits({
    userId,
    type: 'bonus',
    amount: SIGNUP_REWARD_CREDITS,
    description: 'Signup reward - 10 credits for verified email',
  });

  if (!result.success) {
    return { success: false, creditsAwarded: 0, message: 'Failed to add credits' };
  }

  return {
    success: true,
    creditsAwarded: SIGNUP_REWARD_CREDITS,
  };
}

export async function checkSignupRewardEligibility(userId: string): Promise<{
  eligible: boolean;
  reason?: string;
}> {
  const user = await User.findById(userId);
  
  if (!user) {
    return { eligible: false, reason: 'User not found' };
  }

  if (!user.isEmailVerified) {
    return { eligible: false, reason: 'Email not verified' };
  }

  const hasReceivedReward = await CreditTransaction.findOne({
    userId,
    type: 'bonus',
    description: { $regex: /signup reward/i },
  });

  if (hasReceivedReward) {
    return { eligible: false, reason: 'Reward already claimed' };
  }

  return { eligible: true };
}