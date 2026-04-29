'use client';

interface FileItem {
  id: string;
  name: string;
  size: number;
  order: number;
}

interface FileReorderProps {
  files: FileItem[];
  onReorder: (files: FileItem[]) => void;
  onRemove: (fileId: string) => void;
}

export function FileReorder({ files, onReorder, onRemove }: FileReorderProps) {
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;

    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    onReorder(newFiles);
  };

  return (
    <ul>
      {files.map((file, index) => (
        <li key={file.id}>
          <span>{file.name}</span>
          <span>({(file.size / 1024).toFixed(1)} KB)</span>
          <button onClick={() => moveItem(index, 'up')} disabled={index === 0}>↑</button>
          <button onClick={() => moveItem(index, 'down')} disabled={index === files.length - 1}>↓</button>
          <button onClick={() => onRemove(file.id)}>✕</button>
        </li>
      ))}
    </ul>
  );
}