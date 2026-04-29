'use client';

import { ReactNode } from 'react';

interface CreditEstimateProps {
  credits: number;
  showLabel?: boolean;
}

export function CreditEstimateDisplay({
  credits,
  showLabel = true,
}: CreditEstimateProps): ReactNode {
  return (
    <div className="credit-estimate-display">
      {showLabel && <span>Estimated cost: </span>}
      <span className="credit-value">~{credits} credits</span>
    </div>
  );
}