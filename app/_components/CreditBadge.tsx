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
     
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span>💰</span>
      <span>{credits}</span>

      {showTooltip && (
        <div>
          <p>{credits} credits available</p>
          <a href="/credits">Add more</a>
        </div>
      )}
    </div>
  );
}