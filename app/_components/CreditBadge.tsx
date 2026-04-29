'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user-store';

export function CreditBadge() {
  const { credits, fetchUser } = useUserStore();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div 
      className="credit-badge"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="badge-icon">💰</span>
      <span className="badge-amount">{credits}</span>

      {showTooltip && (
        <div className="credit-tooltip">
          <p>{credits} credits available</p>
          <a href="/credits">Add more</a>
        </div>
      )}
    </div>
  );
}