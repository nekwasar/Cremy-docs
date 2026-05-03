import Link from 'next/link';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export default function ProCancelPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Subscription Cancelled</h1>
      <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
        <p>Your Pro subscription was not started.</p>
      </div>
      <Link href="/pro" className={`${b.btn} ${b.soft}`}>Try Again</Link>
    </div>
  );
}
