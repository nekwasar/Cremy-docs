'use client';

import { useState } from 'react';
import { ThemeModal } from './ThemeModal';

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Change theme"
        style={{
          position:'fixed',
          bottom:'var(--space-6)',
          right:'var(--space-6)',
          zIndex:150,
          width:44,
          height:44,
          borderRadius:'var(--radius-full)',
          border:'1px solid var(--color-border)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          cursor:'pointer',
          backdropFilter:'blur(8px)',
          WebkitBackdropFilter:'blur(8px)',
          background:'color-mix(in srgb, var(--color-bg) 70%, transparent)',
          fontSize:'var(--text-lg)',
          transition:'all 0.15s ease',
        }}
      >
        <span style={{fontSize:'var(--text-xl)'}}>🎨</span>
      </button>
      <ThemeModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
