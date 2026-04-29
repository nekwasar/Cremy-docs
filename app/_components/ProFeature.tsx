'use client';

import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

export function ProFeature({ children }: Props) {
  return (
    <div className="pro-feature">
      {children}
      <span className="pro-badge">PRO</span>
    </div>
  );
}

export function LockedFeature({ children }: Props) {
  return (
    <div className="locked-feature">
      <div className="locked-content">{children}</div>
      <div className="locked-overlay">
        <span>🔒</span>
        <p>Upgrade to Pro to unlock</p>
        <Link href="/pro" className="btn-upgrade">
          Upgrade Now
        </Link>
      </div>
    </div>
  );
}