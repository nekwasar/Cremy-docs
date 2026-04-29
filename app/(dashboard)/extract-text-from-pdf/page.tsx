'use client';

import { useState, useRef } from 'react';
import { useUserStore } from '@/store/user-store';

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
    <div className="extract-page">
      <h1>Extract Text from PDF</h1>

      <input
        type="file"
        ref={fileInput}
        onChange={handleFileSelect}
        accept=".pdf,.png,.jpg,.jpeg"
        hidden
      />

      <div className="dropzone" onClick={() => fileInput.current?.click()}>
        {file ? <p>{file.name}</p> : <p>Click to select file</p>}
      </div>

      {text && (
        <div className="extracted-text">
          <textarea value={text} readOnly />
        </div>
      )}

      <div className="extract-actions">
        <button onClick={() => navigator.clipboard.writeText(text)} disabled={!text}>
          Copy
        </button>
        <button onClick={handleExtract} disabled={!file || isExtracting}>
          {isExtracting ? 'Extracting...' : 'Extract (2 credits)'}
        </button>
      </div>
    </div>
  );
}