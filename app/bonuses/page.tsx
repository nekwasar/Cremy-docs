import c from '@/styles/components/Card.module.css';

export default function BonusesPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Current Bonuses</h1>
      <p style={{marginBottom:'var(--space-6)',color:'var(--color-text-muted)'}}>Check out our current bonus offers for new and existing users.</p>

      <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
        <div className={`${c.card} ${c.soft}`}>
          <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-2)'}}>Pro Subscription Bonus</h2>
          <p style={{color:'var(--color-text-muted)'}}>Get extra credits when you subscribe to Pro.</p>
        </div>
        <div className={`${c.card} ${c.soft}`}>
          <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-2)'}}>First Purchase Bonus</h2>
          <p style={{color:'var(--color-text-muted)'}}>First-time credit buyers get bonus credits.</p>
        </div>
      </div>
    </div>
  );
}
