'use client';

import Link from 'next/link';
import s from '@/styles/utilities/layout.css';

export function Footer() {
  return (
    <footer style={{marginTop:'var(--space-16)',padding:'var(--space-12) 0',borderTop:'1px solid var(--color-border)',background:'var(--color-page-bg)'}}>
      <div className={s.container} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'var(--space-8)'}}>
        <div>
          <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Cremy Docs — AI-powered document tools.</p>
        </div>
        <div>
          <h4 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-3)'}}>Tools</h4>
          <ul style={{display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
            <li><Link href="/generate" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Generate</Link></li>
            <li><Link href="/convert" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Convert</Link></li>
            <li><Link href="/translate" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Translate</Link></li>
            <li><Link href="/voice" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Voice</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-3)'}}>Company</h4>
          <ul style={{display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
            <li><Link href="/about" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>About</Link></li>
            <li><Link href="/blog" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Blog</Link></li>
            <li><Link href="/contact" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-3)'}}>Legal</h4>
          <ul style={{display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
            <li><Link href="/privacy" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Privacy Policy</Link></li>
            <li><Link href="/terms" style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className={s.container} style={{marginTop:'var(--space-8)',paddingTop:'var(--space-8)',borderTop:'1px solid var(--color-border-light)',textAlign:'center'}}>
        <p style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>{new Date().getFullYear()} Cremy Docs. All rights reserved.</p>
      </div>
    </footer>
  );
}