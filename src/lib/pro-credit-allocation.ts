import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import CreditTransaction from '@/models/CreditTransaction';

const PRO_CREDIT_MONTHLY = 200;
const PRO_CREDIT_YEARLY = 2400;

export async function allocateProCredits(userId: string, plan: 'monthly' | 'yearly'): Promise<void> {
  await connectDB();

  const subscription = await Subscription.findOne({ userId, status: 'active' });
  if (!subscription) return;

  const creditAmount = plan === 'monthly' ? PRO_CREDIT_MONTHLY : PRO_CREDIT_YEARLY;

  const user = await User.findById(userId) as any;
  if (!user) return;

  const previousProCredits = user.proCredits || 0;
  const previousTotalCredits = user.credits || 0;
  const newTotalCredits = previousTotalCredits + creditAmount;

  await User.findByIdAndUpdate(userId, {
    credits: newTotalCredits,
    proCredits: previousProCredits + creditAmount,
    proCreditsExpires: subscription.currentPeriodEnd,
  });

  await CreditTransaction.create({
    userId,
    type: 'bonus',
    amount: creditAmount,
    balance: newTotalCredits,
    description: `${plan === 'monthly' ? 'Monthly' : 'Yearly'} Pro subscription credits`,
    creditsBefore: previousTotalCredits,
    creditsAfter: newTotalCredits,
    metadata: {
      plan,
      subscriptionId: subscription._id,
      proCreditsAdded: creditAmount,
    },
  });
}

export async function expireProCredits(userId: string): Promise<number> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) return 0;

  const now = new Date();
  if (user.proCreditsExpires && user.proCreditsExpires > now) {
    return 0;
  }

  const expiredCredits = user.proCredits || 0;

  await User.findByIdAndUpdate(userId, {
    proCredits: 0,
    proCreditsExpires: null,
  });

  const transactions = await CreditTransaction.find({
    userId,
    'metadata.proCreditsAdded': { $exists: true },
  });

  for (const tx of transactions) {
    if (tx.metadata?.proCreditsAdded) {
      const currentCredits = user.credits || 0;
      const newCredits = Math.max(0, currentCredits - expiredCredits);

      await User.findByIdAndUpdate(userId, { credits: newCredits });

      await CreditTransaction.create({
        userId,
        type: 'usage',
        amount: -expiredCredits,
        balance: newCredits,
        description: 'Pro credits expired',
        creditsBefore: currentCredits,
        creditsAfter: newCredits,
      });
    }
  }

  return expiredCredits;
}

export async function renewProCredits(userId: string, plan: 'monthly' | 'yearly'): Promise<void> {
  await connectDB();

  const subscription = await Subscription.findOne({ userId, status: 'active' });
  if (!subscription) return;

  const previousProCredits = (await User.findById(userId) as any)?.proCredits || 0;

  await expireProCredits(userId);

  await allocateProCredits(userId, plan);
}

export async function getProCreditStatus(
  userId: string
): Promise<{ proCredits: number; expiresAt: Date | null }> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) return { proCredits: 0, expiresAt: null };

  return {
    proCredits: user.proCredits || 0,
    expiresAt: user.proCreditsExpires || null,
  };
}

export async function checkAndExpireAllProCredits(): Promise<number> {
  await connectDB();

  const expiredSubscriptions = await Subscription.find({
    status: 'active',
    currentPeriodEnd: { $lte: new Date() },
  });

  let totalExpired = 0;

  for (const sub of expiredSubscriptions) {
    const expired = await expireProCredits(sub.userId.toString());
    totalExpired += expired;
  }

  return totalExpired;
}