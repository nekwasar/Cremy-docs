'use client';

import { ReactNode, useState } from 'react';

type CompressionLevel = 'low' | 'medium' | 'high';

interface CompressionLevelSelectorProps {
  onChange?: (level: CompressionLevel) => void;
}

export function CompressionLevelSelector({
  onChange,
}: CompressionLevelSelectorProps): ReactNode {
  const [level, setLevel] = useState<CompressionLevel>('medium');

  const handleChange = (newLevel: CompressionLevel) => {
    setLevel(newLevel);
    onChange?.(newLevel);
  };

  return (
    <div>
      <label>Compression Level</label>
      <div>
        {(['low', 'medium', 'high'] as CompressionLevel[]).map((l) => (
          <button
            key={l}
            className={`level-btn ${level === l ? 'active' : ''}`}
            onClick={() => handleChange(l)}
          >
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}