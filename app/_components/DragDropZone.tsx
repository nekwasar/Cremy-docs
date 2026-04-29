'use client';

import { ReactNode, useState, useCallback } from 'react';

interface DragDropZoneProps {
  onFilesUploaded?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export function DragDropZone({
  onFilesUploaded,
  accept,
  multiple = true,
  maxSize = 10 * 1024 * 1024,
}: DragDropZoneProps): ReactNode {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((f) => f.size <= maxSize);
      if (validFiles.length > 0) {
        setUploadProgress(0);
        onFilesUploaded?.(validFiles);
        setTimeout(() => setUploadProgress(null), 1000);
      }
    },
    [onFilesUploaded, maxSize]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const input = document.createElement('input');
      input.type = 'file';
      if (accept) input.accept = accept;
      if (multiple) input.multiple = true;
      input.onchange = (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        const validFiles = files.filter((f) => f.size <= maxSize);
        if (validFiles.length > 0) {
          setUploadProgress(0);
          onFilesUploaded?.(validFiles);
          setTimeout(() => setUploadProgress(null), 1000);
        }
      };
      input.click();
    },
    [accept, multiple, maxSize, onFilesUploaded]
  );

  return (
    <div
      className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <p>Drop files here or click to upload</p>
      {uploadProgress !== null && (
        <div>{uploadProgress}%</div>
      )}
    </div>
  );
}