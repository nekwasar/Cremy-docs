'use client';

import { useState, useRef } from 'react';
import { useUserStore } from '@/store/user-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function ExtractTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const { credits, deductCredits } = useUserStore();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file || credits < 2) {
      alert('Not enough credits or no file selected');
      return;
    }

    setIsExtracting(true);
    deductCredits(2);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setText(data.data.text);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Tools</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Extract Text</span>
      </div>
      <h1>Extract Text from PDF</h1>

      <div className={c.soft}>
        <input
          type="file"
          ref={fileInput}
          onChange={handleFileSelect}
          accept=".pdf,.png,.jpg,.jpeg"
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

        {text && (
          <div className={i.group}>
            <textarea
              className={`${i.soft} ${i.textarea}`}
              value={text}
              readOnly
              rows={10}
            />
          </div>
        )}

        <div style={{display:'flex',gap:'var(--space-3)'}}>
          <button
            className={b.minimal}
            onClick={() => navigator.clipboard.writeText(text)}
            disabled={!text}
          >
            Copy
          </button>
          <button
            className={b.soft}
            onClick={handleExtract}
            disabled={!file || isExtracting}
          >
            {isExtracting ? null : 'Extract (2 credits)'}
          </button>
        </div>
      </div>
    </div>
  );
}
