import User from '@/models/User';
import Notification from '@/models/Notification';

const CREDIT_THRESHOLDS = [5, 2, 0];

export interface LowBalanceNotification {
  userId: string;
  threshold: number;
  currentCredits: number;
}

export async function checkAndNotifyLowBalance(userId: string, previousCredits: number, currentCredits: number): Promise<void> {
  for (const threshold of CREDIT_THRESHOLDS) {
    if (previousCredits > threshold && currentCredits <= threshold) {
      await createLowBalanceNotification(userId, threshold, currentCredits);
      break;
    }
  }
}

async function createLowBalanceNotification(userId: string, threshold: number, currentCredits: number): Promise<void> {
  const recentNotification = await Notification.findOne({
    userId,
    type: 'low_balance',
    data: { threshold },
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (recentNotification) {
    return;
  }

  const title = threshold === 0 
    ? 'No Credits Remaining' 
    : `Low Credit Balance: ${currentCredits} credits`;
  
  const message = threshold === 0
    ? 'You have used all your credits. Purchase more to continue using the service.'
    : `You have only ${currentCredits} credits remaining. Purchase more to avoid interruption.`;

  await Notification.create({
    userId,
    type: 'low_balance',
    title,
    message,
    link: '/credits/purchase',
    data: { threshold, currentCredits },
  });
}

export async function sendLowBalanceEmail(userId: string, currentCredits: number): Promise<void> {
  // TODO: Implement email notification
  console.log(`[Email] Low balance for user ${userId}: ${currentCredits} credits`);
}