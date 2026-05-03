import c from '@/styles/components/Card.module.css';

export default function SignupClosedPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Registration Temporarily Closed</h1>
      <div className={`${c.card} ${c.soft}`}>
        <p>Registration is temporarily closed. Please check back later.</p>
      </div>
    </div>
  );
}
