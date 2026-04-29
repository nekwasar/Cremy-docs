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
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <h2>Upgrade to Pro</h2>
        <p>Get unlimited access to all features.</p>
        <div>
          <a href="/dashboard/upgrade">
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