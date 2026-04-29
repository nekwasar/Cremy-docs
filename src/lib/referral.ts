import User from '@/models/User';
import Referral from '@/models/Referral';
import { addCredits } from '@/lib/credits';

const REFERRAL_CREDIT_PERCENTAGE = 0.1;
const PRO_REFERRAL_CREDITS = 10;

export interface GenerateReferralCodeResult {
  referralCode: string;
}

export async function generateReferralCode(userId: string): Promise<GenerateReferralCodeResult> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role !== 'free') {
    const existing = await Referral.findOne({ referrerId: userId });
    if (existing) {
      return { referralCode: existing.referralCode };
    }
  }

  const referralCode = `REF${userId.substring(0, 8).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;

  const existingRef = await Referral.findOne({ referralCode });
  if (existingRef) {
    throw new Error('Referral code already exists');
  }

  return { referralCode };
}

export async function applyReferral(
  referrerId: string,
  refereeId: string,
  referralCode: string
): Promise<{ success: boolean; message: string }> {
  if (referrerId === refereeId) {
    return { success: false, message: 'Self-referral not allowed' };
  }

  const existingReferral = await Referral.findOne({ refereeId });
  if (existingReferral) {
    return { success: false, message: 'User already referred' };
  }

  await Referral.create({
    referrerId,
    refereeId,
    referralCode,
    status: 'completed',
  });

  return { success: true, message: 'Referral applied' };
}

export async function rewardReferrerOnCreditPurchase(
  referrerId: string,
  purchaseAmount: number
): Promise<{ success: boolean; creditsAwarded: number }> {
  const referral = await Referral.findOne({ referrerId, status: 'completed' });
  if (!referral) {
    return { success: false, creditsAwarded: 0 };
  }

  const rewardCredits = Math.floor(purchaseAmount * REFERRAL_CREDIT_PERCENTAGE);
  
  if (rewardCredits <= 0) {
    return { success: false, creditsAwarded: 0 };
  }

  await addCredits({
    userId: referrerId,
    type: 'referral',
    amount: rewardCredits,
    description: `Referral reward - 10% of referee credit purchase`,
  });

  referral.totalEarnings += rewardCredits;
  referral.creditRewardGiven = true;
  await referral.save();

  return { success: true, creditsAwarded: rewardCredits };
}

export async function rewardReferrerOnProSubscription(referrerId: string): Promise<{
  success: boolean;
  creditsAwarded: number;
}> {
  const referral = await Referral.findOne({ referrerId, status: 'completed' });
  if (!referral) {
    return { success: false, creditsAwarded: 0 };
  }

  if (referral.proRewardGiven) {
    return { success: false, creditsAwarded: 0 };
  }

  await addCredits({
    userId: referrerId,
    type: 'referral',
    amount: PRO_REFERRAL_CREDITS,
    description: `Referral reward - Pro subscription signup bonus`,
  });

  referral.proRewardGiven = true;
  referral.totalEarnings += PRO_REFERRAL_CREDITS;
  await referral.save();

  return { success: true, creditsAwarded: PRO_REFERRAL_CREDITS };
}

export async function getReferralStats(userId: string): Promise<{
  totalReferrals: number;
  totalEarnings: number;
  successfulReferrals: number;
  pendingReferrals: number;
}> {
  const stats = await Referral.aggregate([
    { $match: { referrerId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalEarnings: { $sum: '$totalEarnings' },
      },
    },
  ]);

  const result = {
    totalReferrals: 0,
    totalEarnings: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
  };

  for (const s of stats) {
    result.totalReferrals += s.count;
    result.totalEarnings += s.totalEarnings;
    if (s._id === 'completed') {
      result.successfulReferrals = s.count;
    } else if (s._id === 'pending') {
      result.pendingReferrals = s.count;
    }
  }

  return result;
}