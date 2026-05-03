'use client';

import { useState, useRef } from 'react';
import { useUserStore } from '@/store/user-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

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
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Tools</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Merge PDF</span>
      </div>
      <h1>Merge PDF</h1>

      <div className={c.soft}>
        <input type="file" multiple ref={fileInput} onChange={handleFiles} hidden />

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
          <p>Click to select files</p>
        </div>

        {files.length > 0 && (
          <ul style={{listStyle:'none',padding:0,margin:'0 0 var(--space-4)'}}>
            {files.map((file, i) => (
              <li key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'var(--space-2) 0',borderBottom:'1px solid var(--color-border)'}}>
                {file.name}
                <button className={b.minimal} onClick={() => removeFile(i)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <button className={b.soft} onClick={handleMerge} disabled={files.length < 2 || isMerging}>
          {isMerging ? null : 'Merge (1 credit)'}
        </button>
      </div>
    </div>
  );
}
