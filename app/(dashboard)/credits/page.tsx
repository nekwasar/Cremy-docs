'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/user-store';

const PACKAGES = [
  { id: 'starter', credits: 10, price: 9.99 },
  { id: 'basic', credits: 50, price: 39.99, bonus: 5 },
  { id: 'pro', credits: 100, price: 69.99, bonus: 15 },
  { id: 'business', credits: 500, price: 299.99, bonus: 100 },
  { id: 'enterprise', credits: 1000, price: 499.99, bonus: 250 },
];

export default function CreditsPage() {
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const { credits, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId);

    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (data.success) {
        fetchUser();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div>
      <h1>Buy Credits</h1>
      <p>Current balance: {credits} credits</p>

      <div>
        {PACKAGES.map((pkg) => (
          <div key={pkg.id}>
            <h3>{pkg.credits} credits</h3>
            {pkg.bonus && <p>+{pkg.bonus} bonus</p>}
            <p>${pkg.price}</p>
            <button
              onClick={() => handlePurchase(pkg.id)}
              disabled={purchasing === pkg.id}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}