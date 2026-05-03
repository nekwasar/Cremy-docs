'use client';

import { ReactNode } from 'react';

const features: string[] = [
  'Create professional documents',
  'Convert any file format',
  'Translate to any language',
  'Voice to document',
  'Extract text from PDF/image',
  'Merge, split, compress PDFs',
  'Change document style',
  'AI-powered editing',
];

export function FeaturesSection(): ReactNode {
  return (
    <div style={{padding:'var(--space-12) 0'}}>
      <h2 style={{textAlign:'center',marginBottom:'var(--space-8)'}}>Features</h2>
      <ul style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'var(--space-4)',maxWidth:'1024px',margin:'0 auto',padding:'0 var(--space-6)'}}>
        {features.map((feature) => (
          <li key={feature} style={{padding:'var(--space-4)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-lg)',fontSize:'var(--text-sm)',textAlign:'center'}}>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}