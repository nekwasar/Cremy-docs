'use client';

import { ReactNode } from 'react';

interface EditToolbarProps {
  onRemovePages?: () => void;
  onRotatePages?: () => void;
}

export function EditToolbar({
  onRemovePages,
  onRotatePages,
}: EditToolbarProps): ReactNode {
  return (
    <div>
      <button onClick={onRemovePages}>
        Remove Pages
      </button>
      <button onClick={onRotatePages}>
        Rotate Pages
      </button>
    </div>
  );
}