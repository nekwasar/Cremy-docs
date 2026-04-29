import { getMongoDb } from '@/lib/mongodb';

export async function expireProCredits(): Promise<void> {
  const db = await getMongoDb();
  
  const now = new Date();
  
  const proUsers = await db.collection('subscriptions').find({
    status: 'active',
    currentPeriodEnd: { $lt: now },
  }).toArray();

  for (const sub of proUsers) {
    await db.collection('users').updateOne(
      { _id: sub.userId },
      { $set: { 'proCredits': 0 } }
    );
  }

  return { expired: proUsers.length };
}

export async function allocateProCredits(userId: string, plan: 'monthly' | 'yearly'): Promise<void> {
  const db = await getMongoDb();
  
  const credits = plan === 'monthly' ? 200 : 2400;
  
  await db.collection('users').updateOne(
    { _id: userId },
    { $set: { proCredits: credits } }
  );

  await db.collection('credit_transactions').insertOne({
    userId,
    amount: credits,
    type: 'pro_allocation',
    description: `${plan} Pro subscription credit allocation`,
    balance: credits,
    createdAt: new Date(),
  });
}