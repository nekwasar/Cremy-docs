'use client';

import { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
}

export function FileUploader({
  onFileSelected,
  accept = '*',
  maxSize = 10 * 1024 * 1024,
  label = 'Upload File',
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError('');
    if (file.size > maxSize) {
      setError(`File too large. Max ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {isDragging ? <p>Drop file here</p> : <p>Drag and drop or click to {label.toLowerCase()}</p>}
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleChange} style={{ display: 'none' }} />
      {error && <p>{error}</p>}
    </div>
  );
}