import { getMongoDb } from '@/lib/mongodb';

export async function handleSubscriptionRenew(userId: string): Promise<void> {
  const db = await getMongoDb();
  const sub = await db.collection('subscriptions').findOne({ userId, status: 'active' });

  if (!sub) return;

  const credits = sub.plan === 'yearly' ? 2400 : 200;
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + (sub.plan === 'yearly' ? 12 : 1));

  await db.collection('subscriptions').updateOne(
    { _id: sub._id },
    { $set: { currentPeriodEnd: periodEnd, updatedAt: new Date() } }
  );

  await db.collection('users').updateOne(
    { _id: userId },
    { $inc: { credits } }
  );

  await db.collection('credit_transactions').insertOne({
    userId,
    type: 'subscription_renewal',
    amount: credits,
    plan: sub.plan,
    createdAt: new Date(),
  });
}

export async function handleSubscriptionExpire(userId: string): Promise<void> {
  const db = await getMongoDb();

  await db.collection('subscriptions').updateOne(
    { userId, status: 'active' },
    { $set: { status: 'expired', updatedAt: new Date() } }
  );

  await db.collection('users').updateOne(
    { _id: userId },
    { $set: { role: 'free' } }
  );
}

export async function cancelUserSubscription(userId: string): Promise<void> {
  const db = await getMongoDb();

  await db.collection('subscriptions').updateOne(
    { userId, status: 'active' },
    { $set: { cancelAtPeriodEnd: true, canceledAt: new Date(), updatedAt: new Date() } }
  );
}
