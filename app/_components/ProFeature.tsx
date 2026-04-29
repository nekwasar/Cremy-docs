'use client';

import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

export function ProFeature({ children }: Props) {
  return (
    <div>
      {children}
      <span>PRO</span>
    </div>
  );
}

export function LockedFeature({ children }: Props) {
  return (
    <div>
      <div>{children}</div>
      <div>
        <span>🔒</span>
        <p>Upgrade to Pro to unlock</p>
        <Link href="/pro">
          Upgrade Now
        </Link>
      </div>
    </div>
  );
}