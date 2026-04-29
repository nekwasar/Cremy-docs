'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  title?: string;
  documentId?: string;
  onClose?: () => void;
}

export function PostActionModal({ isOpen, title = 'Download Complete!', documentId, onClose }: Props) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 10000);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="post-action-modal">
        <div className="success-checkmark">✓</div>
        <h2>{title}</h2>
        <p>Your document is ready!</p>

        <div className="modal-actions">
          <Link href={`/preview?doc=${documentId}`} className="btn-primary">
            View Document
          </Link>
          <button onClick={onClose} className="btn-secondary">
            Start New Project
          </button>
        </div>

        <p className="countdown">Auto-closing in {countdown}s</p>
      </div>
    </div>
  );
}