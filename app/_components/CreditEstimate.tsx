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
    <div>
      {showLabel && <span>Estimated cost: </span>}
      <span>~{credits} credits</span>
    </div>
  );
}