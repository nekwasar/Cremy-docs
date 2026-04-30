'use client';

interface ImageOptionsProps {
  onRemove: () => void;
  onReplace: (file: File) => void;
}

export function ImageOptions({ onRemove, onReplace }: ImageOptionsProps) {
  const handleReplace = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) onReplace(file);
    };
    input.click();
  };

  return (
    <div>
      <button type="button" onClick={onRemove}>Remove</button>
      <button type="button" onClick={handleReplace}>Replace</button>
    </div>
  );
}