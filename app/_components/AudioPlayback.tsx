'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlaybackProps {
  audioBlob: Blob;
}

export function AudioPlayback({ audioBlob }: AudioPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div>
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} preload="auto" />
      )}
      <button onClick={togglePlayback} type="button">
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
}