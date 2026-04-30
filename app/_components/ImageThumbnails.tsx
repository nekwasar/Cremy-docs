'use client';

import { useImageStore } from '@/store/image-store';

interface ImageThumbnailsProps {
  onRemove: (imageId: string) => void;
  onReplace: (imageId: string) => void;
  editable?: boolean;
}

export function ImageThumbnails({
  onRemove,
  onReplace,
  editable = false,
}: ImageThumbnailsProps) {
  const images = useImageStore((s) => s.images);

  if (images.length === 0) return null;

  return (
    <div>
      <p>{images.length} image{images.length !== 1 ? 's' : ''} attached</p>
      <div>
        {images.map((img) => (
          <div key={img.id}>
            <img
              src={img.base64}
              alt={img.altText || img.fileName}
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
            <div>
              <span>{img.fileName}</span>
              <span>{(img.size / 1024).toFixed(0)} KB</span>
            </div>
            <p>{img.placement || 'No placement specified'}</p>
            {editable && (
              <div>
                <button onClick={() => onRemove(img.id)} type="button">
                  Remove
                </button>
                <button onClick={() => onReplace(img.id)} type="button">
                  Replace
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}