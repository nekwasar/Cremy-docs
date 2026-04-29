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
    <div className="edit-toolbar">
      <button className="toolbar-btn" onClick={onRemovePages}>
        Remove Pages
      </button>
      <button className="toolbar-btn" onClick={onRotatePages}>
        Rotate Pages
      </button>
    </div>
  );
}