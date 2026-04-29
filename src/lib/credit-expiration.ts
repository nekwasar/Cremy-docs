import mongoose from 'mongoose';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';

export interface ExpirationResult {
  userId: string;
  creditsExpired: number;
}

const GRACE_PERIOD_DAYS = 7;
const DEFAULT_EXPIRATION_DAYS = 90;

export async function expireCreditsForUser(userId: string): Promise<ExpirationResult> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  let creditsExpired = 0;

  if (user.lastCreditResetAt) {
    const expirationDate = new Date(user.lastCreditResetAt);
    expirationDate.setDate(expirationDate.getDate() + DEFAULT_EXPIRATION_DAYS);

    if (new Date() > expirationDate) {
      const expiredCredits = user.credits;
      creditsExpired = expiredCredits;

      user.credits = 0;
      await user.save();

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await CreditTransaction.create(
          [
            {
              userId: user._id,
              type: 'admin',
              amount: -creditsExpired,
              balance: 0,
              creditsBefore: expiredCredits,
              creditsAfter: 0,
              description: 'Credits expired (90-day policy)',
              metadata: { reason: 'expiration', gracePeriodDays: GRACE_PERIOD_DAYS },
            },
          ],
          { session }
        );

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }
  }

  return { userId, creditsExpired };
}

export async function processExpiredCredits(
  batchSize: number = 100
): Promise<{ processed: number; expired: ExpirationResult[] }> {
  const users = await User.find({
    lastCreditResetAt: {
      $lt: new Date(Date.now() - (DEFAULT_EXPIRATION_DAYS + GRACE_PERIOD_DAYS) * 24 * 60 * 60 * 1000),
    },
    credits: { $gt: 0 },
  })
    .limit(batchSize)
    .lean();

  const expired: ExpirationResult[] = [];

  for (const user of users) {
    try {
      const result = await expireCreditsForUser(user._id.toString());
      if (result.creditsExpired > 0) {
        expired.push(result);
      }
    } catch (error) {
      console.error(`Failed to expire credits for user ${user._id}:`, error);
    }
  }

  return { processed: users.length, expired };
}

export async function checkCreditsExpiringSoon(userId: string): Promise<{
  hasExpiring: boolean;
  expiringCredits: number;
  expirationDate: Date;
}> {
  const user = await User.findById(userId);
  if (!user || !user.lastCreditResetAt) {
    return { hasExpiring: false, expiringCredits: 0, expirationDate: new Date() };
  }

  const expirationDate = new Date(user.lastCreditResetAt);
  expirationDate.setDate(expirationDate.getDate() + DEFAULT_EXPIRATION_DAYS);

  const daysUntilExpiration = Math.ceil(
    (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiration <= 7 && daysUntilExpiration > 0) {
    return {
      hasExpiring: true,
      expiringCredits: user.credits,
      expirationDate,
    };
  }

  return { hasExpiring: false, expiringCredits: 0, expirationDate };
}