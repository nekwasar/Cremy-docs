'use client';

import { useRef } from 'react';

interface AddImageButtonProps {
  imageCount: number;
  onImageAdd: (file: File) => void;
  maxImages?: number;
}

export function AddImageButton({
  imageCount,
  onImageAdd,
  maxImages = 5,
}: AddImageButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageAdd(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={imageCount >= maxImages}
      >
        Add Image ({imageCount}/{maxImages})
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}