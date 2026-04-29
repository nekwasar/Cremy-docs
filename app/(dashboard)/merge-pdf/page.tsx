'use client';

import { useState, useRef } from 'react';
import { useUserStore } from '@/store/user-store';

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const { credits, deductCredits } = useUserStore();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2 || credits < 1) {
      alert('Select at least 2 files');
      return;
    }

    setIsMerging(true);
    deductCredits(1);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch('/api/merge', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = `/preview?doc=${data.data.documentId}`;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div>
      <h1>Merge PDF</h1>

      <input type="file" multiple ref={fileInput} onChange={handleFiles} hidden />
      <div onClick={() => fileInput.current?.click()}>
        <p>Click to select files</p>
      </div>

      {files.length > 0 && (
        <ul>
          {files.map((file, i) => (
            <li key={i}>
              {file.name}
              <button onClick={() => removeFile(i)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleMerge} disabled={files.length < 2 || isMerging}>
        {isMerging ? 'Merging...' : 'Merge (1 credit)'}
      </button>
    </div>
  );
}