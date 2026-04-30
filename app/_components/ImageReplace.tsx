'use client';

import { useRef } from 'react';

interface ImageReplaceProps {
  imageId: string;
  onReplace: (imageId: string, file: File) => void;
}

export function ImageReplace({ imageId, onReplace }: ImageReplaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onReplace(imageId, file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <button onClick={() => fileInputRef.current?.click()} type="button">
        Replace
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}