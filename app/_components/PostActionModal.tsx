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
    <div>
      <div>
        <div>✓</div>
        <h2>{title}</h2>
        <p>Your document is ready!</p>

        <div>
          <Link href={`/preview?doc=${documentId}`}>
            View Document
          </Link>
          <button onClick={onClose}>
            Start New Project
          </button>
        </div>

        <p>Auto-closing in {countdown}s</p>
      </div>
    </div>
  );
}