'use client';

import { ReactNode } from 'react';

interface WaveformPlaceholderProps {
  isPlaying?: boolean;
}

export function WaveformPlaceholder({
  isPlaying = false,
}: WaveformPlaceholderProps): ReactNode {
  return (
    <div className="waveform-placeholder">
      <span className="placeholder-text">
        {isPlaying ? 'Playing...' : 'Recording...'}
      </span>
      <div className="placeholder-bars">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="bar" />
        ))}
      </div>
    </div>
  );
}