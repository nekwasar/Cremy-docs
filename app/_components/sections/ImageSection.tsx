'use client';

import { useState } from 'react';

interface ImageSectionProps {
  content: { src: string; alt: string };
  editable?: boolean;
  onChange?: (src: string, alt: string) => void;
  elementId?: string;
  isNew?: boolean;
  onRemove?: () => void;
}

export function ImageSection({
  content,
  editable = false,
  onChange,
  elementId,
  isNew = false,
  onRemove,
}: ImageSectionProps) {
  const [showOptions, setShowOptions] = useState(false);

  const attrs: Record<string, any> = {
    'data-element-id': elementId || '',
  };
  if (isNew) attrs['data-new'] = 'true';

  const handleReplace = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file && onChange) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          onChange(ev.target?.result as string, content.alt);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setShowOptions(false);
  };

  return (
    <div {...attrs} onClick={() => setShowOptions(!showOptions)}>
      <img src={content.src} alt={content.alt} />
      {showOptions && (
        <div>
          <button type="button" onClick={() => { onRemove?.(); setShowOptions(false); }}>Remove</button>
          <button type="button" onClick={handleReplace}>Replace</button>
        </div>
      )}
      {editable && onChange && (
        <div>
          <input
            type="text"
            value={content.alt}
            onChange={(e) => onChange(content.src, e.target.value)}
            placeholder="Alt text"
          />
        </div>
      )}
    </div>
  );
}