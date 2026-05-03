'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/user-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

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
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Account</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Credits</span>
      </div>
      <h1>Buy Credits</h1>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <p style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-medium)'}}>
          Current balance: {credits} credits
        </p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'var(--space-4)'}}>
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className={c.soft}>
            <h3 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',margin:'0 0 var(--space-1)'}}>
              {pkg.credits} credits
            </h3>
            {pkg.bonus && (
              <p style={{color:'var(--color-primary)',fontSize:'var(--text-sm)',margin:'0 0 var(--space-2)'}}>
                +{pkg.bonus} bonus
              </p>
            )}
            <p style={{fontSize:'var(--text-xl)',fontWeight:'var(--weight-semibold)',margin:'0 0 var(--space-4)'}}>
              ${pkg.price}
            </p>
            <button
              className={b.soft}
              onClick={() => handlePurchase(pkg.id)}
              disabled={purchasing === pkg.id}
            >
              {purchasing === pkg.id ? null : 'Buy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
