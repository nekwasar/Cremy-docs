'use client';

import { ReactNode, useEffect } from 'react';
import { useUIStore } from '../../src/store';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps): ReactNode | null {
  const { setActiveModal, activeModal } = useUIStore();

  useEffect(() => {
    if (isOpen) {
      setActiveModal('upgrade');
    } else if (activeModal === 'upgrade') {
      setActiveModal(null);
    }
  }, [isOpen, setActiveModal, activeModal]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',background:'color-mix(in srgb, var(--color-page-bg) 40%, transparent)'}}>
      <div onClick={(e) => e.stopPropagation()} style={{background:'var(--color-modal-bg)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'var(--space-8)',maxWidth:'420px',width:'100%',margin:'var(--space-4)'}}>
        <h2>Upgrade to Pro</h2>
        <p>Get unlimited access to all features.</p>
        <div>
          <a href="/pro">
            Upgrade Now
          </a>
          <button onClick={onClose}>
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}