'use client';

import { ReactNode, useState, useEffect } from 'react';

interface CharacterCounterProps {
  value: string;
  max?: number;
  showRemaining?: boolean;
}

export function CharacterCounter({
  value,
  max = 10000,
  showRemaining = true,
}: CharacterCounterProps): ReactNode {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(value.length);
  }, [value]);

  const remaining = max - count;
  const isOverLimit = remaining < 0;

  return (
    <div className={`character-counter ${isOverLimit ? 'over-limit' : ''}`}>
      {showRemaining ? (
        <span>
          {count}/{max} ({remaining} remaining)
        </span>
      ) : (
        <span>{count} characters</span>
      )}
      {isOverLimit && <span className="limit-warning">Over limit</span>}
    </div>
  );
}