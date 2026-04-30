'use client';

import { useState } from 'react';

interface MergeOrderHandlerProps {
  files: Array<{ id: string; name: string }>;
  onConfirm: (orderedFileIds: string[]) => void;
}

export function MergeOrderHandler({ files, onConfirm }: MergeOrderHandlerProps) {
  const [orderedFiles, setOrderedFiles] = useState([...files]);

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...orderedFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setOrderedFiles(newFiles);
  };

  return (
    <div>
      <p>Which file goes first?</p>
      <p>Arrange files in the desired order:</p>
      <ul>
        {orderedFiles.map((file, index) => (
          <li key={file.id}>
            <span>{file.name}</span>
            <button onClick={() => moveFile(index, 'up')} disabled={index === 0}>↑</button>
            <button onClick={() => moveFile(index, 'down')} disabled={index === orderedFiles.length - 1}>↓</button>
          </li>
        ))}
      </ul>
      <button onClick={() => onConfirm(orderedFiles.map((f) => f.id))}>
        Confirm Order &amp; Merge
      </button>
    </div>
  );
}