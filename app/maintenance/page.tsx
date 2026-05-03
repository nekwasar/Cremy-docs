import c from '@/styles/components/Card.module.css';

export default function MaintenancePage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Under Maintenance</h1>
      <div className={`${c.card} ${c.soft}`}>
        <p>We are currently performing maintenance. Please check back soon.</p>
      </div>
    </div>
  );
}
