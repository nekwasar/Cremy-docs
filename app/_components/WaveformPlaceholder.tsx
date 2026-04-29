'use client';

import { ReactNode } from 'react';

interface WaveformPlaceholderProps {
  isPlaying?: boolean;
}

export function WaveformPlaceholder({
  isPlaying = false,
}: WaveformPlaceholderProps): ReactNode {
  return (
    <div>
      <span>
        {isPlaying ? 'Playing...' : 'Recording...'}
      </span>
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} />
        ))}
      </div>
    </div>
  );
}