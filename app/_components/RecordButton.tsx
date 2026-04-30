'use client';

import { useState, useRef } from 'react';
import { startRecording, stopRecording, cancelRecording } from '@/lib/audio-recorder';

interface RecordButtonProps {
  onRecordingComplete: (blob: Blob) => void;
  onRecordingStart: () => void;
  onRecordingCancel: () => void;
  disabled?: boolean;
  maxDuration?: number;
}

export function RecordButton({
  onRecordingComplete,
  onRecordingStart,
  onRecordingCancel,
  disabled = false,
  maxDuration = 120,
}: RecordButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleMouseDown = async () => {
    if (disabled || isHolding) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();

    try {
      await startRecording();
      onRecordingStart();
    } catch {
      setIsHolding(false);
      return;
    }

    durationTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed >= maxDuration) {
        handleMouseUp();
      }
    }, 100);
  };

  const handleMouseUp = async () => {
    if (!isHolding) return;
    setIsHolding(false);

    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }

    try {
      const blob = await stopRecording();
      onRecordingComplete(blob);
    } catch {
      cancelRecording();
      onRecordingCancel();
    }
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      disabled={disabled}
      type="button"
    >
      {isHolding ? 'Recording... (Release to Stop)' : 'Hold to Record'}
    </button>
  );
}