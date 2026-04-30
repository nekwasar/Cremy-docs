'use client';

interface ImageCreditDisplayProps {
  imageCount: number;
  creditCost: number;
}

export function ImageCreditDisplay({ imageCount, creditCost }: ImageCreditDisplayProps) {
  if (imageCount === 0) return null;

  return (
    <div>
      <span>{imageCount} image{imageCount !== 1 ? 's' : ''}: +{creditCost} credit{creditCost !== 1 ? 's' : ''}</span>
      <span>1 credit per image</span>
    </div>
  );
}