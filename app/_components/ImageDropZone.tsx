'use client';

import { useState } from 'react';

interface ImageDropZoneProps {
  onFilesDropped: (files: File[]) => void;
  disabled?: boolean;
}

export function ImageDropZone({ onFilesDropped, disabled = false }: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );

    if (files.length > 0) {
      onFilesDropped(files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging ? (
        <p>Drop images here</p>
      ) : (
        <p>Drag and drop images here, or click to browse</p>
      )}
    </div>
  );
}