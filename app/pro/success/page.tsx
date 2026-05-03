import Link from 'next/link';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export default function ProSuccessPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Welcome to Pro!</h1>

      <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
        <p>Your Pro subscription is now active.</p>
        <p style={{marginTop:'var(--space-4)',fontWeight:'var(--weight-medium)'}}>You now have access to:</p>
        <ul style={{marginTop:'var(--space-3)',paddingLeft:'var(--space-6)',display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
          <li>Pro credits every month</li>
          <li>Unlimited cloud storage</li>
          <li>Version history</li>
          <li>Priority support</li>
        </ul>
      </div>

      <div style={{display:'flex',gap:'var(--space-3)'}}>
        <Link href="/generate" className={`${b.btn} ${b.soft}`}>Start Creating</Link>
        <Link href="/dashboard" className={`${b.btn} ${b.minimal}`}>Go to Dashboard</Link>
      </div>
    </div>
  );
}
