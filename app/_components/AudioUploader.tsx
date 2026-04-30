'use client';

import { useRef } from 'react';
import { validateAudioFile } from '@/lib/audio-validation';

interface AudioUploaderProps {
  onFileSelected: (file: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function AudioUploader({ onFileSelected, onError, disabled = false }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAudioFile(file);
    if (!validation.valid) {
      onError(validation.error || 'Invalid file');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    onFileSelected(file);
  };

  return (
    <div>
      <button onClick={() => fileInputRef.current?.click()} disabled={disabled} type="button">
        Upload Audio File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.m4a,.webm,.ogg,audio/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <p>Accepted: MP3, WAV, M4A (max 10MB)</p>
    </div>
  );
}