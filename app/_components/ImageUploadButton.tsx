'use client';

import { useRef } from 'react';
import { useImageStore } from '@/store/image-store';

interface ImageUploadButtonProps {
  userId: string;
  userCredits: number;
  isPro: boolean;
  onImageSelected: (file: File, placement: string) => void;
  placement?: string;
}

export function ImageUploadButton({
  userId,
  userCredits,
  isPro,
  onImageSelected,
  placement = '',
}: ImageUploadButtonProps) {
  const { images, maxReached } = useImageStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const max = isPro ? 5 : userCredits >= 10 ? 5 : 0;
  const count = images.length;
  const disabled = maxReached || max === 0 || count >= max;

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file, placement);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <button onClick={handleClick} disabled={disabled} type="button">
        Add Image ({count}/{max})
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {max === 0 && !isPro && (
        <p>Image upload requires 10+ credits or Pro</p>
      )}
      {disabled && maxReached && <p>Max {max} images reached</p>}
    </div>
  );
}