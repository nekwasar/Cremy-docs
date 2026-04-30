'use client';

interface RecordingFeedbackProps {
  isRecording: boolean;
  duration: number;
  maxDuration?: number;
}

export function RecordingFeedback({
  isRecording,
  duration,
  maxDuration = 120,
}: RecordingFeedbackProps) {
  if (!isRecording) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div>
        <span>● Recording...</span>
      </div>
      <span>{formatTime(duration)} / {formatTime(maxDuration)}</span>
    </div>
  );
}