'use client';

import { useState, useRef } from 'react';
import { useUserStore } from '@/store/user-store';

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
    <div>
      <h1>Split PDF</h1>
      <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <input type="text" placeholder="e.g., 1-3,5,7-10" value={pages} onChange={(e) => setPages(e.target.value)} />
      <button onClick={handleSplit} disabled={!file || isSplitting}>
        {isSplitting ? 'Splitting...' : 'Split (1 credit)'}
      </button>
    </div>
  );
}