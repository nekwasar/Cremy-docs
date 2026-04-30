'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/user-store';
import { ProPlanSelect } from '../_components/ProPlanSelect';
import { PaymentMethodSelect } from '../_components/PaymentMethodSelect';
import type { ProcessorName } from '@/config/payment';

export default function ProPage() {
  const { user } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [processor, setProcessor] = useState<ProcessorName | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const monthlyPrice = 9;
  const yearlyPrice = 86;
  const monthlyCredits = 200;
  const yearlyCredits = 2400;

  const handleSubscribe = async () => {
    if (!selectedPlan || !processor) return;
    setLoading(true);

    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'subscribe_pro',
        plan: selectedPlan,
        price: selectedPlan === 'monthly' ? monthlyPrice : yearlyPrice,
        currency: 'USD',
        processor,
      }),
    });

    const data = await res.json();
    if (data.success && data.data.redirectUrl) {
      window.location.href = data.data.redirectUrl;
    } else {
      setError(data.data?.error || 'Failed');
      setLoading(false);
    }
  };

  const isPro = user?.role === 'pro';

  if (isPro) {
    return (
      <div>
        <h1>You are a Pro Member</h1>
        <p>Enjoy your Pro features!</p>
        <Link href="/account/subscription">Manage Subscription</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Upgrade to Pro</h1>

      <ProPlanSelect
        selected={selectedPlan}
        onSelect={setSelectedPlan}
        monthlyPrice={monthlyPrice}
        yearlyPrice={yearlyPrice}
        monthlyCredits={monthlyCredits}
        yearlyCredits={yearlyCredits}
      />

      {selectedPlan && (
        <PaymentMethodSelect value={processor} onChange={setProcessor} />
      )}

      {error && <p>{error}</p>}

      <button
        onClick={handleSubscribe}
        disabled={!selectedPlan || !processor || loading}
      >
        {loading ? 'Processing...' : `Subscribe - $${selectedPlan === 'monthly' ? monthlyPrice : yearlyPrice}`}
      </button>
    </div>
  );
}