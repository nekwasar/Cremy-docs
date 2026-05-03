'use client';

import Link from 'next/link';
import { useUserStore } from '@/store/user-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export default function BuyCreditsSuccessPage() {
  const { credits } = useUserStore();

  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Purchase Successful!</h1>

      <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
        <p>Your credits have been added to your account.</p>
        <p style={{marginTop:'var(--space-3)',fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)'}}>New balance: {credits} credits</p>
      </div>

      <div style={{display:'flex',gap:'var(--space-3)'}}>
        <Link href="/generate" className={`${b.btn} ${b.soft}`}>Generate a Document</Link>
        <Link href="/dashboard" className={`${b.btn} ${b.minimal}`}>Go to Dashboard</Link>
      </div>
    </div>
  );
}
