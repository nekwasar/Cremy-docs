'use client';

import { useState } from 'react';

interface GenerateFormProps {
  onSubmit: (text: string, tone?: string, format?: string) => void;
  disabled?: boolean;
}

export function GenerateForm({ onSubmit, disabled = false }: GenerateFormProps) {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('professional');
  const [format, setFormat] = useState('pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text, tone, format);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe what you want to create..."
        rows={4}
        disabled={disabled}
      />
      <div>
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="txt">TXT</option>
          <option value="md">Markdown</option>
        </select>
      </div>
      <button type="submit" disabled={disabled || !text.trim()}>
        Generate Document
      </button>
    </form>
  );
}