'use client';

import { useUserStore } from '@/store/user-store';

interface CreditBalanceProps {
  showDetails?: boolean;
}

export function CreditBalance({ showDetails = false }: CreditBalanceProps) {
  const credits = useUserStore((state) => state.credits);
  const role = useUserStore((state) => state.user?.role);

  if (role === 'pro') {
    return <span>Unlimited Credits</span>;
  }

  return (
    <div>
      <span>{credits} credits</span>
      {showDetails && (
        <div>
          <p>Available: {credits}</p>
          <p>Used this month: --</p>
        </div>
      )}
    </div>
  );
}