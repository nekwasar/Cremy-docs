'use client';

import { useRef } from 'react';

interface ImageFilePickerProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function ImageFilePicker({
  onFilesSelected,
  maxFiles = 5,
  disabled = false,
}: ImageFilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <button onClick={() => fileInputRef.current?.click()} disabled={disabled} type="button">
        Choose Images
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}