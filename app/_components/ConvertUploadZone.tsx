'use client';

import { useState, useRef } from 'react';
import d from '@/styles/components/Dropzone.module.css';

interface ConvertUploadZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export function ConvertUploadZone({ onFileSelected, disabled = false, className }: ConvertUploadZoneProps) {
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
      className={`${d.zone} ${d.soft} ${isDragging ? d.zoneDrag : ''} ${className || ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className={d.softIcon}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      </div>
      {isDragging ? (
        <p className={d.softText}>Drop your file here</p>
      ) : (
        <p className={d.softText}>Drag and drop your file here, or click to browse</p>
      )}
      <p className={d.softText}>Supports: DOC, DOCX, PDF, PPT, XLS, TXT, HTML, EPUB and more</p>
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