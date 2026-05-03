'use client';

import { useState, useRef } from 'react';
import { useUserStore } from '@/store/user-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

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
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Tools</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Edit File</span>
      </div>
      <h1>Edit File</h1>

      <div className={c.soft}>
        <input
          type="file"
          ref={fileInput}
          onChange={handleFileSelect}
          accept=".pdf,.docx"
          hidden
        />

        <div
          onClick={() => fileInput.current?.click()}
          style={{
            border:'2px dashed var(--color-border)',
            borderRadius:'var(--radius-md)',
            padding:'var(--space-8) var(--space-4)',
            textAlign:'center',
            cursor:'pointer',
            marginBottom:'var(--space-4)',
          }}
        >
          {file ? <p>{file.name}</p> : <p>Click to select file</p>}
        </div>

        <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap',marginBottom:'var(--space-4)'}}>
          <button className={b.soft} onClick={() => handleEdit('remove-pages')}>
            Remove Pages
          </button>
          <button className={b.soft} onClick={() => handleEdit('rotate')}>
            Rotate Pages
          </button>
          <button className={b.soft} onClick={() => handleEdit('reorder')}>
            Reorder Pages
          </button>
        </div>

        <button className={b.editorial}>Download Edited File</button>
      </div>
    </div>
  );
}
