import Link from 'next/link';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export default function BuyCreditsCancelPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Purchase Cancelled</h1>
      <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
        <p>Your payment was not completed.</p>
      </div>
      <div style={{display:'flex',gap:'var(--space-3)'}}>
        <Link href="/buy-credits" className={`${b.btn} ${b.soft}`}>Try Again</Link>
        <Link href="/" className={`${b.btn} ${b.minimal}`}>Go Home</Link>
      </div>
    </div>
  );
}
