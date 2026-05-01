import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';

const SIGNUP_REWARD_CREDITS = 10;

export async function addSignupReward(userId: string): Promise<boolean> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) return false;

  if (user.receivedSignupReward) {
    return false;
  }

  const previousCredits = user.credits || 0;
  const newCredits = previousCredits + SIGNUP_REWARD_CREDITS;

  await User.findByIdAndUpdate(userId, {
    credits: newCredits,
    receivedSignupReward: true,
  });

  await CreditTransaction.create({
    userId,
    type: 'bonus',
    amount: SIGNUP_REWARD_CREDITS,
    balance: newCredits,
    description: 'Signup reward - 10 credits',
    creditsBefore: previousCredits,
    creditsAfter: newCredits,
  });

  return true;
}

export async function checkSignupRewardEligible(userId: string): Promise<boolean> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) return false;

  return !user.receivedSignupReward && user.isEmailVerified;
}

export async function hasReceivedSignupReward(userId: string): Promise<boolean> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) return false;

  return user.receivedSignupReward ?? false;
}