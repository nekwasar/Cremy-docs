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
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',background:'color-mix(in srgb, var(--color-page-bg) 40%, transparent)'}}>
      <div onClick={(e) => e.stopPropagation()} style={{background:'var(--color-modal-bg)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'var(--space-8)',maxWidth:'380px',width:'100%',margin:'var(--space-4)'}}>
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