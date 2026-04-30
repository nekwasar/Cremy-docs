interface StorageErrorResult {
  type: 'localstorage_full' | 'mongodb_connection_failed' | 'storage_degraded';
  message: string;
  canContinue: boolean;
  suggestions: string[];
}

export function handleLocalStorageFull(
  currentUsageBytes: number,
  estimatedNeededBytes: number
): StorageErrorResult {
  const usedMB = (currentUsageBytes / (1024 * 1024)).toFixed(1);

  const canAutoClean = tryAutoCleanLocalStorage();

  if (canAutoClean) {
    return {
      type: 'localstorage_full',
      message: 'Your local storage was full. We automatically cleaned up old drafts to free space. Your recent documents are safe.',
      canContinue: true,
      suggestions: [
        'Upgrade to Pro for unlimited cloud storage',
        'Regularly clean up old documents in settings',
        'Download important documents before clearing',
      ],
    };
  }

  return {
    type: 'localstorage_full',
    message: `Your browser storage is full (${usedMB}MB used). Cannot save new documents locally.`,
    canContinue: false,
    suggestions: [
      'Upgrade to Pro for unlimited cloud storage',
      'Clear old documents from your dashboard',
      'Download and then delete documents you no longer need',
      'Clear your browser data in Settings',
    ],
  };
}

function tryAutoCleanLocalStorage(): boolean {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('documents_drafts')) keys.push(key);
    }
    if (keys.length > 0) {
      keys.forEach((key) => localStorage.removeItem(key));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function handleMongoDBConnectionFailed(): StorageErrorResult {
  return {
    type: 'mongodb_connection_failed',
    message: 'Cloud storage is temporarily unavailable. Your work has been saved locally instead.',
    canContinue: true,
    suggestions: [
      'Your document is saved in local storage',
      'It will sync to the cloud when the connection is restored',
      'You can continue working — your data is safe',
    ],
  };
}

export function handleStorageDegraded(): StorageErrorResult {
  return {
    type: 'storage_degraded',
    message: 'Storage is operating in degraded mode. Basic saving is still available.',
    canContinue: true,
    suggestions: [
      'Essential features are still available',
      'Some Pro features may be temporarily limited',
      'Your data is not at risk',
    ],
  };
}

export async function handleProToFreeDowngrade(userId: string): Promise<{
  message: string;
  preservedData: boolean;
}> {
  try {
    const db = await (await import('@/lib/mongodb')).getMongoDb();
    const user = await db.collection('users').findOne({ _id: userId });

    if (!user || user.role !== 'pro') {
      return { message: '', preservedData: true };
    }

    const sub = await db.collection('subscriptions').findOne({ userId, status: 'active' });
    if (sub) {
      const now = new Date();
      if (now > new Date(sub.currentPeriodEnd)) {
        await db.collection('subscriptions').updateOne(
          { _id: sub._id },
          { $set: { status: 'expired', updatedAt: now } }
        );
        await db.collection('users').updateOne(
          { _id: userId },
          { $set: { role: 'free' } }
        );
      }
    }

    return {
      message: 'Your Pro subscription has ended. All your documents are preserved and accessible. Upgrade anytime to restore Pro features.',
      preservedData: true,
    };
  } catch {
    return {
      message: 'Unable to check subscription status. Your access may be limited.',
      preservedData: true,
    };
  }
}

export function handlePaymentFailure(
  processor: string,
  reason: string
): {
  message: string;
  retryable: boolean;
  alternativeProcessors: string[];
} {
  return {
    message: `Payment via ${processor} failed: ${reason}. You can try again or use a different payment method.`,
    retryable: true,
    alternativeProcessors: ['stripe', 'flutterwave', 'paystack', 'paypal'].filter((p) => p !== processor),
  };
}

export function handleSubscriptionPaymentFailure(
  userId: string,
  plan: string
): {
  message: string;
  gracePeriodDays: number;
  action: 'retry' | 'update_payment' | 'downgrade';
} {
  return {
    message: `Your ${plan} subscription payment failed. You have a 7-day grace period to update your payment method before your Pro access is paused.`,
    gracePeriodDays: 7,
    action: 'update_payment',
  };
}
