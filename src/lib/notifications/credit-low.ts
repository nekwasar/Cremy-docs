import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Notification from '@/models/Notification';
import emailService from '@/services/email';

const LOW_BALANCE_THRESHOLDS = [5, 2, 0];

export async function checkLowBalance(
  userId: string,
  currentBalance: number
): Promise<{ notified: boolean; threshold: number | null }> {
  await connectDB();

  const user = await User.findById(userId);
  if (!user || user.role === 'pro') {
    return { notified: false, threshold: null };
  }

  const lastNotification = await Notification.findOne({
    userId,
    type: 'low_balance',
  })
    .sort({ createdAt: -1 })
    .select('createdAt');

  for (const threshold of LOW_BALANCE_THRESHOLDS) {
    if (currentBalance <= threshold) {
      if (lastNotification) {
        const hoursSinceNotification =
          (Date.now() - lastNotification.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceNotification < 24) {
          continue;
        }
      }

      await Notification.create({
        userId,
        type: 'low_balance',
        title: 'Low Credit Balance',
        message: `Your balance is ${currentBalance} credits. Upgrade to get more!`,
        isRead: false,
        data: { threshold, currentBalance },
      });

      if (user.email) {
        await emailService.sendEmail({
          to: user.email,
          subject: 'Low Credit Balance - Cremy Docs',
          html: `<p>Your credit balance is running low!</p>
                 <p>Current balance: <strong>${currentBalance} credits</strong></p>
                 <p>Upgrade now to never run out of credits.</p>`,
        });
      }

      return { notified: true, threshold };
    }
  }

  return { notified: false, threshold: null };
}

export async function sendLowBalanceReminder(userId: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) return;

  await checkLowBalance(userId, user.credits || 0);
}

export async function processAllLowBalanceReminders(): Promise<number> {
  await connectDB();

  const users = await User.find({
    role: { $ne: 'pro' },
    credits: { $lte: 5 },
  });

  let notified = 0;

  for (const user of users) {
    const result = await checkLowBalance(user._id.toString(), user.credits || 0);
    if (result.notified) notified++;
  }

  return notified;
}