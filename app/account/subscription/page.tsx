'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/user-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

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
    <div style={{ maxWidth: 'var(--container-md)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>Subscription Management</h1>

      {subscription ? (
        <div className={c.card} style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>
            Current Plan: Pro {subscription.plan === 'yearly' ? 'Yearly' : 'Monthly'}
          </h2>
          <p style={{ marginBottom: 'var(--space-2)' }}>Status: {subscription.status}</p>
          <p style={{ marginBottom: 'var(--space-2)' }}>
            Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
          {subscription.cancelAtPeriodEnd && (
            <p style={{ color: 'var(--color-warning)', marginBottom: 'var(--space-4)' }}>
              Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Link href="/pro" className={`${b.btn} ${b.soft}`}>Change Plan</Link>
            {!subscription.cancelAtPeriodEnd && (
              <button className={`${b.btn} ${b.raw}`} onClick={handleCancel}>Cancel Subscription</button>
            )}
          </div>
        </div>
      ) : (
        <div className={c.card} style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <p style={{ marginBottom: 'var(--space-4)' }}>You don&apos;{`t`} have an active subscription.</p>
          <Link href="/pro" className={`${b.btn} ${b.soft}`}>Upgrade to Pro</Link>
        </div>
      )}

      <Link href="/account/billing" className={`${b.btn} ${b.raw}`}>
        View Payment History
      </Link>
    </div>
  );
}
