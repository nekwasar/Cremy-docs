'use client';

import { ReactNode } from 'react';

export function HeroSection(): ReactNode {
  return (
    <div style={{padding:'var(--space-20) 0',textAlign:'center'}}>
      <h1 style={{fontSize:'var(--text-3xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Documents, done smoothly.</h1>
      <p style={{fontSize:'var(--text-lg)',color:'var(--color-text-secondary)',maxWidth:'600px',margin:'0 auto var(--space-8)',lineHeight:'var(--leading-relaxed)'}}>
        Create, convert, translate, and more — all in one place.
      </p>
      <div style={{padding:'var(--space-16)',border:'1px dashed var(--color-border)',borderRadius:'var(--radius-lg)',maxWidth:'700px',margin:'0 auto'}}>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Animated Demo Area</span>
      </div>
    </div>
  );
}