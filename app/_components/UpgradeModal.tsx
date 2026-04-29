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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Upgrade to Pro</h2>
        <p>Get unlimited access to all features.</p>
        <div className="modal-actions">
          <a href="/dashboard/upgrade" className="btn-primary">
            Upgrade Now
          </a>
          <button className="btn-secondary" onClick={onClose}>
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}