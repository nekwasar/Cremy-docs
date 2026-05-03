'use client';

import { useRef, useState } from 'react';
import { useImageStore } from '@/store/image-store';
import { processImage } from '@/lib/image-pipeline';
import { handleImageError } from '@/lib/image-errors';
import { getImageLimitForUser } from '@/lib/image-limits';
import { ImageThumbnails } from './ImageThumbnails';
import { ImageCreditDisplay } from './ImageCreditDisplay';

interface AddImageButtonProps {
  imageCount: number;
  onImageAdd: (file: File) => void;
  maxImages?: number;
  userId?: string;
  userCredits?: number;
  isPro?: boolean;
}

export function AddImageButton({
  imageCount,
  onImageAdd,
  maxImages = 5,
  userId = 'session',
  userCredits = 0,
  isPro = false,
}: AddImageButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { addImage, removeImage, replaceImage } = useImageStore();

  const max = getImageLimitForUser(userCredits, isPro);
  const disabled = imageCount >= max || max === 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);

      const result = await processImage(file, userId);
      setUploadProgress(70);

      if (result.success && result.image) {
        addImage(result.image);
        onImageAdd(file);
        setUploadProgress(100);
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError(handleImageError(error).message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleRemove = (imageId: string) => {
    removeImage(imageId);
  };

  const handleReplace = (imageId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
    input.onchange = async (ev: any) => {
      const file = ev.target?.files?.[0];
      if (!file) return;

      try {
        const result = await processImage(file, userId);
        if (result.success && result.image) {
          replaceImage(imageId, result.image);
          onImageAdd(file);
        }
      } catch (error) {
        setUploadError(handleImageError(error).message);
      }
    };
    input.click();
  };

  return (
    <div>
      <ImageThumbnails
        onRemove={handleRemove}
        onReplace={handleReplace}
        editable={true}
      />

      <ImageCreditDisplay
        imageCount={useImageStore.getState().images.length}
        creditCost={useImageStore.getState().getTotalCredits()}
      />


      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
      >
        Add Image ({imageCount}/{max})
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {max === 0 && !isPro && (
        <p>Image upload requires 10+ credits or Pro subscription</p>
      )}
      {disabled && max > 0 && <p>Max {max} images reached</p>}
    </div>
  );
}