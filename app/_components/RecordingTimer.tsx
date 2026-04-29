'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';

interface RecordingTimerProps {
  maxSeconds?: number;
  onStop?: (duration: number) => void;
}

export function RecordingTimer({
  maxSeconds = 120,
  onStop,
}: RecordingTimerProps): ReactNode {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const toggle = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      onStop?.(seconds);
    } else {
      setSeconds(0);
      setIsRecording(true);
    }
  }, [isRecording, seconds, onStop]);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s >= maxSeconds) {
          setIsRecording(false);
          onStop?.(s);
          return s;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, maxSeconds, onStop]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="recording-timer">
      <span className="timer-display">
        {formatTime(seconds)} / {formatTime(maxSeconds)}
      </span>
      <button className="timer-toggle" onClick={toggle}>
        {isRecording ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}