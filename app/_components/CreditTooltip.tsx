'use client';

import { ReactNode, useState } from 'react';
import { useUserStore } from '../../src/store';

interface CreditTooltipProps {}

export function CreditTooltip({}: CreditTooltipProps): ReactNode {
  const { credits } = useUserStore();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="credit-tooltip"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="credit-icon">💰</span>
      {isVisible && (
        <div className="tooltip-content">
          <p>Balance: {credits} credits</p>
          <a href="/credits">Buy More</a>
        </div>
      )}
    </div>
  );
}