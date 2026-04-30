'use client';

interface ImageRemoveProps {
  imageId: string;
  onRemove: (imageId: string) => void;
  creditRefund?: number;
}

export function ImageRemove({ imageId, onRemove, creditRefund }: ImageRemoveProps) {
  return (
    <button onClick={() => onRemove(imageId)} type="button">
      Remove{creditRefund ? ` (+${creditRefund} credit refund)` : ''}
    </button>
  );
}