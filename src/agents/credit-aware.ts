import { getMongoDb } from '@/lib/mongodb';

const CREDIT_THRESHOLD = 0.75;

interface CreditAssessment {
  canProceed: boolean;
  message: string;
  remaining: number;
  bannerType?: 'signup' | 'upgrade' | 'warning' | null;
}

export async function assessCreditCapacity(
  userId: string,
  requiredCredits: number
): Promise<CreditAssessment> {
  if (requiredCredits <= 0) {
    return { canProceed: true, message: '', remaining: 0 };
  }

  if (!userId) {
    return {
      canProceed: false,
      message: `This task requires ${requiredCredits} credits. Create a free account to get credits.`,
      remaining: 0,
      bannerType: 'signup',
    };
  }

  try {
    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
      return {
        canProceed: false,
        message: 'User account not found.',
        remaining: 0,
      };
    }

    if (user.role === 'pro') {
      return { canProceed: true, message: '', remaining: Infinity };
    }

    const remaining = user.credits || 0;
    const canComplete = remaining >= requiredCredits * CREDIT_THRESHOLD;

    if (canComplete && remaining < requiredCredits) {
      return {
        canProceed: true,
        message: `You have ${remaining} credits but need ${requiredCredits}. The task will complete but your balance will go negative.`,
        remaining,
        bannerType: 'warning',
      };
    }

    if (!canComplete && remaining === 0) {
      return {
        canProceed: false,
        message: `This task requires ${requiredCredits} credits. You have 0 credits. Purchase credits or upgrade to Pro.`,
        remaining,
        bannerType: 'upgrade',
      };
    }

    if (!canComplete) {
      return {
        canProceed: false,
        message: `This task requires ${requiredCredits} credits but you only have ${remaining}. Not enough to proceed (minimum 75% required).`,
        remaining,
        bannerType: 'upgrade',
      };
    }

    return { canProceed: true, message: '', remaining };
  } catch {
    return {
      canProceed: false,
      message: 'Unable to verify credits. Please try again.',
      remaining: 0,
    };
  }
}
