'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/user-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const { credits, deductCredits } = useUserStore();

  const handleSplit = async () => {
    if (!file || credits < 1) {
      alert('Select a file');
      return;
    }

    setIsSplitting(true);
    deductCredits(1);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pages', pages);

    try {
      const response = await fetch('/api/split', {
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
      setIsSplitting(false);
    }
  };

  return (
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Tools</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Split PDF</span>
      </div>
      <h1>Split PDF</h1>

      <div className={c.soft}>
        <div className={i.group}>
          <label className={i.label}>PDF File</label>
          <input
            className={i.soft}
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className={i.group}>
          <label className={i.label}>Page Ranges</label>
          <input
            className={i.soft}
            type="text"
            placeholder="e.g., 1-3,5,7-10"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />
        </div>

        <button className={b.soft} onClick={handleSplit} disabled={!file || isSplitting}>
          {isSplitting ? null : 'Split (1 credit)'}
        </button>
      </div>
    </div>
  );
}
