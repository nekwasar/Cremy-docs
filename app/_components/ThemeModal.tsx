'use client';

import { useState, useEffect } from 'react';

const THEMES = [
  { id:'raw-light', label:'Raw Light', primary:'#ccc', bg:'#ffffff', text:'#0f172a' },
  { id:'raw-dark', label:'Raw Dark', primary:'#444', bg:'#0a0a0a', text:'#f1f5f9' },
  { id:'blue-light', label:'Blue Light', primary:'#2563eb', bg:'#ffffff', text:'#0f172a' },
  { id:'blue-dark', label:'Blue Dark', primary:'#3b82f6', bg:'#000000', text:'#f1f5f9' },
  { id:'orange-light', label:'Orange Light', primary:'#ea580c', bg:'#ffffff', text:'#1c1917' },
  { id:'orange-dark', label:'Orange Dark', primary:'#f97316', bg:'#000000', text:'#f1f5f9' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeModal({ isOpen, onClose }: Props) {
  const [active, setActive] = useState('blue-light');

  useEffect(() => {
    const stored = localStorage.getItem('cremy-theme');
    if (stored) setActive(stored);
  }, []);

  const applyTheme = (themeId: string) => {
    setActive(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('cremy-theme', themeId);
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',background:'color-mix(in srgb, var(--color-page-bg) 40%, transparent)'}}>
      <div onClick={e => e.stopPropagation()} style={{width:'100%',maxWidth:'440px',margin:'var(--space-4)',padding:'var(--space-6)',background:'var(--color-bg)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--space-5)'}}>
          <h3 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)'}}>Theme</h3>
          <button onClick={onClose} style={{width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid var(--color-border)',borderRadius:'var(--radius-sm)',fontSize:'var(--text-lg)',cursor:'pointer',background:'transparent'}}>×</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'var(--space-3)'}}>
          {THEMES.map(t => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => applyTheme(t.id)}
                style={{
                  padding:'var(--space-4)',
                  border: isActive ? '2px solid var(--color-primary, #2563eb)' : '1px solid var(--color-border)',
                  borderRadius:'var(--radius-lg)',
                  cursor:'pointer',
                  textAlign:'left',
                  background:'var(--color-surface)',
                  transition:'all 0.15s ease',
                }}
              >
                <div style={{display:'flex',gap:'var(--space-2)',marginBottom:'var(--space-3)',alignItems:'center'}}>
                  <span style={{width:18,height:18,borderRadius:'var(--radius-full)',background:t.primary,border:'1px solid var(--color-border)',flexShrink:0,display:'inline-block'}} />
                  <span style={{width:18,height:18,borderRadius:'var(--radius-full)',background:t.bg,border:'1px solid var(--color-border)',flexShrink:0,display:'inline-block'}} />
                  <span style={{width:18,height:18,borderRadius:'var(--radius-full)',background:t.text,border:'1px solid var(--color-border)',flexShrink:0,display:'inline-block'}} />
                </div>
                <div style={{fontSize:'var(--text-sm)',fontWeight:isActive?'var(--weight-semibold)':'var(--weight-regular)'}}>{t.label}</div>
                <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-secondary)',marginTop:'var(--space-1)'}}>{t.id.includes('light')?'Light mode':'Dark mode'}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
