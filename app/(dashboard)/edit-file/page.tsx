'use client';

import { useState, useRef } from 'react';
import { useUserStore } from '@/store/user-store';

export default function EditFilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const { credits, deductCredits } = useUserStore();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEdit = async (action: string) => {
    if (!file || credits < 1) {
      alert('Not enough credits');
      return;
    }

    deductCredits(1);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', action);

    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = `/preview?doc=${data.data.documentId}`;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Edit File</h1>

      <input
        type="file"
        ref={fileInput}
        onChange={handleFileSelect}
        accept=".pdf,.docx"
        hidden
      />

      <div onClick={() => fileInput.current?.click()}>
        {file ? <p>{file.name}</p> : <p>Click to select file</p>}
      </div>

      <div>
        <button onClick={() => handleEdit('remove-pages')}>
          Remove Pages
        </button>
        <button onClick={() => handleEdit('rotate')}>
          Rotate Pages
        </button>
        <button onClick={() => handleEdit('reorder')}>
          Reorder Pages
        </button>
      </div>

      <button>Download Edited File</button>
    </div>
  );
}