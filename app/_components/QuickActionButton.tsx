'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface QuickActionButtonProps {
  label: string;
  route: string;
  disabled?: boolean;
  badge?: string;
  className?: string;
}

export function QuickActionButton({
  label,
  route,
  disabled = false,
  badge,
  className = '',
}: QuickActionButtonProps): ReactNode {
  return (
    <Link
      href={disabled ? '#' : route}
      className={`quick-action-button ${disabled ? 'disabled' : ''} ${className}`}
      onClick={(e) => disabled && e.preventDefault()}
    >
      <span>{label}</span>
      {badge && <span>{badge}</span>}
    </Link>
  );
}