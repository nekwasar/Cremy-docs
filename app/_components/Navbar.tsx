'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import s from '@/styles/components/Navbar.module.css';

const LINKS = [
  { href: '/templates', label: 'Templates' },
  { href: '/generate', label: 'Generate' },
  { href: '/convert', label: 'Convert' },
  { href: '/translate', label: 'Translate' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, credits } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className={`${s.nav} ${s.soft}`}>
        <Link href="/" className={`${s.logo} ${s.logoUppercase}`}>Cremy Docs</Link>
        <span className={s.spacer} />
        <div className={s.softLinks}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className={`${s.softLink} ${pathname === l.href ? s.active : ''}`}>{l.label}</Link>
          ))}
          <span className={s.softLink}>{credits} credits</span>
          {user ? (
            <Link href="/dashboard" className={s.softLink}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className={s.softLink}>Login</Link>
              <Link href="/register" className={s.softLink}>Sign Up</Link>
            </>
          )}
        </div>
        <button
          className={s.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{background:'none',border:'none',fontSize:'var(--text-xl)',cursor:'pointer',padding:'var(--space-2)',color:'var(--color-text)'}}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{position:'fixed',inset:0,zIndex:55,backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',background:'color-mix(in srgb, var(--color-page-bg) 40%, transparent)'}}>
          <div onClick={e => e.stopPropagation()} style={{position:'fixed',top:0,right:0,bottom:0,width:'280px',zIndex:56,background:'var(--color-page-bg)',borderLeft:'1px solid var(--color-border)',padding:'var(--space-6)',display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--space-4)'}}>
              <span style={{fontWeight:'var(--weight-semibold)'}}>Menu</span>
              <button onClick={() => setMobileOpen(false)} style={{background:'none',border:'none',fontSize:'var(--text-xl)',cursor:'pointer',color:'var(--color-text)'}}>✕</button>
            </div>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{fontSize:'var(--text-base)',padding:'var(--space-2) 0',borderBottom:'1px solid var(--color-border-light)'}}>Home</Link>
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{fontSize:'var(--text-base)',padding:'var(--space-2) 0',borderBottom:'1px solid var(--color-border-light)',fontWeight:pathname===l.href?'var(--weight-semibold)':'var(--weight-regular)'}}>{l.label}</Link>
            ))}
            <div style={{borderTop:'1px solid var(--color-border)',paddingTop:'var(--space-4)',marginTop:'var(--space-2)'}}>
              <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>{credits} credits</span>
            </div>
            <div style={{marginTop:'auto'}}>
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{display:'block',padding:'var(--space-3) 0',fontSize:'var(--text-base)'}}>Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} style={{display:'block',padding:'var(--space-3) 0',fontSize:'var(--text-base)'}}>Login</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} style={{display:'block',padding:'var(--space-3) 0',fontSize:'var(--text-base)',fontWeight:'var(--weight-semibold)'}}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
