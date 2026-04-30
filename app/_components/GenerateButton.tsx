'use client';

import { ReactNode, useState } from 'react';

type GenerateButtonState = 'idle' | 'loading' | 'disabled';

interface GenerateButtonProps {
  onClick: () => void;
  state?: GenerateButtonState;
  creditEstimate?: number;
  disabledReason?: string;
}

export function GenerateButton({
  onClick,
  state = 'idle',
  creditEstimate,
  disabledReason,
}: GenerateButtonProps): ReactNode {
  const [hoverText, setHoverText] = useState<string | null>(null);

  const getLabel = () => {
    if (state === 'loading') return 'Generating...';
    if (state === 'disabled') return disabledReason || 'Fill in the form';
    return 'Generate Document';
  };

  const canClick = state === 'idle';

  return (
    <div>
      <button
        onClick={canClick ? onClick : undefined}
        disabled={!canClick}
        onMouseEnter={() => {
          if (creditEstimate && creditEstimate > 0) {
            setHoverText(`~${creditEstimate} credits`);
          }
        }}
        onMouseLeave={() => setHoverText(null)}
      >
        {getLabel()}
      </button>
      {hoverText && <span>{hoverText}</span>}
    </div>
  );
}