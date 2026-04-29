'use client';

import { ReactNode } from 'react';

interface FileListProps {
  files: { name: string; size: number; id: string }[];
  onRemove?: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  showOrder?: boolean;
}

export function FileList({
  files,
  onRemove,
  onReorder,
  showOrder = false,
}: FileListProps): ReactNode {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="file-list">
      {files.map((file, index) => (
        <div key={file.id} className="file-item">
          {showOrder && <span className="file-order">{index + 1}</span>}
          <span className="file-name">{file.name}</span>
          <span className="file-size">{formatSize(file.size)}</span>
          {onRemove && (
            <button
              className="file-remove"
              onClick={() => onRemove(file.id)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}