'use client';

import { ImageRemove } from './ImageRemove';
import { ImageReplace } from './ImageReplace';

interface ImageOptionsModalProps {
  imageId: string;
  imageName: string;
  onClose: () => void;
  onRemove: (imageId: string) => void;
  onReplace: (imageId: string, file: File) => void;
}

export function ImageOptionsModal({
  imageId,
  imageName,
  onClose,
  onRemove,
  onReplace,
}: ImageOptionsModalProps) {
  return (
    <div>
      <div>
        <h3>Image Options</h3>
        <p>{imageName}</p>

        <div>
          <ImageRemove
            imageId={imageId}
            onRemove={onRemove}
            creditRefund={1}
          />
          <ImageReplace imageId={imageId} onReplace={onReplace} />
        </div>

        <button onClick={onClose} type="button">Close</button>
      </div>
    </div>
  );
}