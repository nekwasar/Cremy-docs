'use client';

import { useState, useRef } from 'react';
import d from '@/styles/components/Dropzone.module.css';

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

  return (
    <div
      className={`${d.zone} ${d.soft} ${isDragging ? d.zoneDrag : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {isDragging ? <p className={d.softText}>Drop file here</p> : <p className={d.softText}>Drag and drop or click to {label.toLowerCase()}</p>}
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleChange} style={{ display: 'none' }} />
      {error && <p style={{fontSize:'var(--text-xs)',marginTop:'var(--space-2)'}}>{error}</p>}
    </div>
  );
}