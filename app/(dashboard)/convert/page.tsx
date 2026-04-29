'use client';

import { useState, useCallback } from 'react';
import { useUserStore } from '@/store/user-store';

const FORMATS = ['PDF', 'DOCX', 'TXT', 'MD'];

export default function ConvertPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [fromFormat, setFromFormat] = useState('PDF');
  const [toFormat, setToFormat] = useState('DOCX');
  const [isConverting, setIsConverting] = useState(false);
  const { credits, deductCredits } = useUserStore();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    if (credits < 2) {
      alert('Not enough credits');
      return;
    }

    setIsConverting(true);
    deductCredits(2);

    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));
    formData.append('fromFormat', fromFormat);
    formData.append('toFormat', toFormat);

    try {
      const response = await fetch('/api/convert', {
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
      setIsConverting(false);
    }
  };

  return (
    <div>
      <h1>Convert File</h1>

      <div>
        <div>
          <label>From</label>
          <select value={fromFormat} onChange={(e) => setFromFormat(e.target.value)}>
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>→</div>

        <div>
          <label>To</label>
          <select value={toFormat} onChange={(e) => setToFormat(e.target.value)}>
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      <div
       
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>Drag files here or click to select</p>
        <input type="file" onChange={handleFileSelect} multiple />
      </div>

      {files.length > 0 && (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <span>{file.name}</span>
              <button onClick={() => removeFile(index)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <div>
        <p>Cost: 2 credits</p>
        <button
          onClick={handleConvert}
          disabled={files.length === 0 || isConverting}
         
        >
          {isConverting ? 'Converting...' : 'Convert'}
        </button>
      </div>
    </div>
  );
}