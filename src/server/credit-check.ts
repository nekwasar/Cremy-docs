import { getMongoDb } from '@/lib/mongodb';

export async function checkAndDeductCredits(
  userId: string,
  requiredCredits: number,
  operation: string
): Promise<{ allowed: boolean; remaining: number; error?: string }> {
  if (requiredCredits <= 0) {
    return { allowed: true, remaining: 0 };
  }

  const db = await getMongoDb();
  const user = await db.collection('users').findOne({ _id: userId });

  if (!user) {
    return { allowed: false, remaining: 0, error: 'User not found' };
  }

  if (user.role === 'pro') {
    return { allowed: true, remaining: Infinity };
  }

  if (user.credits < requiredCredits) {
    return {
      allowed: false,
      remaining: user.credits,
      error: `Insufficient credits: need ${requiredCredits}, have ${user.credits}`,
    };
  }

  await db.collection('users').updateOne(
    { _id: userId },
    { $inc: { credits: -requiredCredits } }
  );

  return { allowed: true, remaining: user.credits - requiredCredits };
}

export async function refundCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<void> {
  const db = await getMongoDb();
  await db.collection('users').updateOne(
    { _id: userId },
    { $inc: { credits: amount } }
  );

  await db.collection('credit_transactions').insertOne({
    userId,
    type: 'refund',
    amount,
    description: reason,
    createdAt: new Date(),
  });
}
