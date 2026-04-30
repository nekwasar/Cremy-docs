'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { CreditPackSelect } from '../_components/CreditPackSelect';
import { PaymentMethodSelect } from '../_components/PaymentMethodSelect';
import type { ProcessorName } from '@/config/payment';
import Link from 'next/link';

export default function BuyCreditsPage() {
  const router = useRouter();
  const { user, credits } = useUserStore();
  const [packs, setPacks] = useState<any[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [processor, setProcessor] = useState<ProcessorName | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPacks(data.data?.bundles || []);
        }
      });
  }, []);

  const selectedPackData = packs.find((p) => p.id === selectedPack);

  const handlePurchase = async () => {
    if (!selectedPack || !processor) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'buy_credits',
        packId: selectedPack,
        credits: selectedPackData?.credits || 0,
        price: selectedPackData?.price || 0,
        currency: 'USD',
        processor,
      }),
    });

    const data = await res.json();
    if (data.success && data.data.redirectUrl) {
      window.location.href = data.data.redirectUrl;
    } else {
      setError(data.data?.error || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Buy Credits</h1>
      <p>Current balance: {credits} credits</p>

      <CreditPackSelect packs={packs} selected={selectedPack} onSelect={setSelectedPack} />

      {selectedPack && (
        <PaymentMethodSelect value={processor} onChange={setProcessor} />
      )}

      {error && <p>{error}</p>}

      <button
        onClick={handlePurchase}
        disabled={!selectedPack || !processor || loading}
      >
        {loading ? 'Processing...' : `Buy Credits - $${selectedPackData?.price || 0}`}
      </button>
    </div>
  );
}