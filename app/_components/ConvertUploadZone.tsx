'use client';

import { useState, useRef } from 'react';

interface ConvertUploadZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function ConvertUploadZone({ onFileSelected, disabled = false }: ConvertUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {isDragging ? (
        <p>Drop your file here</p>
      ) : (
        <p>Drag and drop your file here, or click to browse</p>
      )}
      <p>Supports: DOC, DOCX, PDF, PPT, XLS, TXT, HTML, EPUB and more</p>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
    </div>
  );
}