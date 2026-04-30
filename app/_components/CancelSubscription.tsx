'use client';

interface CancelSubscriptionProps {
  onCancel: () => void;
}

export function CancelSubscription({ onCancel }: CancelSubscriptionProps) {
  return (
    <button onClick={onCancel}>
      Cancel Subscription
    </button>
  );
}