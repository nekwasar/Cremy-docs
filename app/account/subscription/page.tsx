'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/user-store';

export default function SubscriptionPage() {
  const { user } = useUserStore();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSubscription(data.data.subscription);
        setLoading(false);
      });
  }, []);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will keep Pro access until the end of your billing period.')) return;
    await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel_subscription' }),
    });
    alert('Subscription cancelled. You will keep Pro access until the end of your billing period.');
    window.location.reload();
  };

  if (loading) return null;

  return (
    <div>
      <h1>Subscription Management</h1>

      {subscription ? (
        <div>
          <h2>Current Plan: Pro {subscription.plan === 'yearly' ? 'Yearly' : 'Monthly'}</h2>
          <p>Status: {subscription.status}</p>
          <p>Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
          {subscription.cancelAtPeriodEnd && (
            <p>Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
          )}

          <div>
            <h3>Actions</h3>
            <Link href="/pro">Change Plan</Link>
            {!subscription.cancelAtPeriodEnd && (
              <button onClick={handleCancel}>Cancel Subscription</button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>You don&apos;{`t`} have an active subscription.</p>
          <Link href="/pro">Upgrade to Pro</Link>
        </div>
      )}

      <Link href="/account/billing">View Payment History</Link>
    </div>
  );
}