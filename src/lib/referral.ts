import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Referral from '@/models/Referral';
import CreditTransaction from '@/models/CreditTransaction';

const REFERRAL_BONUS_PERCENT = 0.1;
const PRO_SUBSCRIPTION_BONUS = 10;

export async function generateReferralCode(userId: string): Promise<string> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) throw new Error('User not found');

  if (user.referralCode) {
    return user.referralCode;
  }

  const code = crypto.randomBytes(4).toString('hex').toUpperCase();

  await User.findByIdAndUpdate(userId, { referralCode: code });

  return code;
}

export async function getUserReferralCode(userId: string): Promise<string | null> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) return null;

  return user.referralCode || null;
}

export async function applyReferral(
  referrerId: string,
  refereeId: string
): Promise<boolean> {
  await connectDB();

  if (referrerId === refereeId) return false;

  const existingReferral = await Referral.findOne({
    $or: [
      { referrerId, refereeId },
      { refereeId: referrerId },
    ],
  });

  if (existingReferral) return false;

  await Referral.create({
    referrerId,
    refereeId,
    status: 'pending',
  });

  return true;
}

export async function recordReferralPurchase(
  referrerId: string,
  amount: number
): Promise<void> {
  await connectDB();

  const bonusCredits = Math.floor(amount * REFERRAL_BONUS_PERCENT);

  const referrer = await User.findById(referrerId);
  if (!referrer) return;

  const previousCredits = referrer.credits || 0;
  const newCredits = previousCredits + bonusCredits;

  await User.findByIdAndUpdate(referrerId, {
    credits: newCredits,
  });

  await CreditTransaction.create({
    userId: referrerId,
    type: 'bonus',
    amount: bonusCredits,
    balance: newCredits,
    description: `Referral bonus - 10% of $${amount} purchase`,
    creditsBefore: previousCredits,
    creditsAfter: newCredits,
  });

  await Referral.findOneAndUpdate(
    { referrerId, status: 'pending' },
    { status: 'active' }
  );
}

export async function recordReferralSubscription(referrerId: string): Promise<void> {
  await connectDB();

  const referrer = await User.findById(referrerId);
  if (!referrer) return;

  const previousCredits = referrer.credits || 0;
  const newCredits = previousCredits + PRO_SUBSCRIPTION_BONUS;

  await User.findByIdAndUpdate(referrerId, {
    credits: newCredits,
  });

  await CreditTransaction.create({
    userId: referrerId,
    type: 'bonus',
    amount: PRO_SUBSCRIPTION_BONUS,
    balance: newCredits,
    description: 'Referral bonus - Pro subscription',
    creditsBefore: previousCredits,
    creditsAfter: newCredits,
  });
}

export async function getReferralStats(
  userId: string
): Promise<{ totalReferrals: number; activeReferrals: number; totalCredits: number }> {
  await connectDB();

  const stats = await Referral.aggregate([
    { $match: { referrerId: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const activeCount =
    stats.find((s) => s._id === 'active')?.count || 0;
  const pendingCount =
    stats.find((s) => s._id === 'pending')?.count || 0;

  const transactions = await CreditTransaction.find({
    userId,
    description: { $regex: 'Referral bonus' },
  });

  const totalCredits = transactions.reduce((sum, t) => sum + t.amount, 0);

  return {
    totalReferrals: activeCount + pendingCount,
    activeReferrals: activeCount,
    totalCredits,
  };
}

export async function getReferralHistory(
  userId: string
): Promise<{ refereeId: string; status: string; createdAt: Date }[]> {
  await connectDB();

  const referrals = await Referral.find({ referrerId: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .select('refereeId status createdAt');

  return referrals.map((r) => ({
    refereeId: r.refereeId.toString(),
    status: r.status,
    createdAt: r.createdAt,
  }));
}