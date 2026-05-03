import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export const metadata = generatePageMetadata({
  title: 'Contact',
  description: 'Get in touch with the Cremy Docs team. We value your feedback and are here to help.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Contact Us</h1>

      <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
        <p>Have questions, feedback, or need help? Reach out to us.</p>
        <p style={{marginTop:'var(--space-4)'}}>Email: support@cremydocs.com</p>
      </div>

      <div className={`${c.card} ${c.soft}`}>
        <form style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
          <div>
            <label style={{display:'block',marginBottom:'var(--space-2)',fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)'}}>Name</label>
            <input type="text" name="name" style={{width:'100%',padding:'var(--space-3)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)',background:'var(--color-surface-bg)',color:'var(--color-text)',fontSize:'var(--text-base)'}} />
          </div>
          <div>
            <label style={{display:'block',marginBottom:'var(--space-2)',fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)'}}>Email</label>
            <input type="email" name="email" style={{width:'100%',padding:'var(--space-3)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)',background:'var(--color-surface-bg)',color:'var(--color-text)',fontSize:'var(--text-base)'}} />
          </div>
          <div>
            <label style={{display:'block',marginBottom:'var(--space-2)',fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)'}}>Message</label>
            <textarea name="message" rows={5} style={{width:'100%',padding:'var(--space-3)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)',background:'var(--color-surface-bg)',color:'var(--color-text)',fontSize:'var(--text-base)',resize:'vertical'}} />
          </div>
          <button type="submit" className={`${b.btn} ${b.soft}`}>Send Message</button>
        </form>
      </div>
    </div>
  );
}
