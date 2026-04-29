import { getMongoDb } from '@/lib/mongodb';

export async function expireCredits(): Promise<void> {
  const db = await getMongoDb();
  
  const now = new Date();
  
  const result = await db.collection('users').updateMany(
    { 'creditsExpiry': { $lt: now, $exists: true } },
    { $inc: { credits: 0 } }
  );

  console.log(`Credit expiration job ran: ${result.modifiedCount} users checked`);
}

export async function notifyExpiringCredits(): Promise<void> {
  const db = await getMongoDb();
  
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const users = await db.collection('users').find({
    creditsExpiry: {
      $gte: new Date(),
      $lte: sevenDaysFromNow,
    },
  }).toArray();

  for (const user of users) {
    await db.collection('notifications').insertOne({
      userId: user._id.toString(),
      type: 'credit_expiring',
      title: 'Credits expiring soon',
      message: 'Some of your credits will expire in the next 7 days.',
      isRead: false,
      createdAt: new Date(),
    });
  }
}