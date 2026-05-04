'use client';

import { useState } from 'react';
import { Select } from './Select';

const FORMATS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'md', label: 'Markdown' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
];

export function GenerateForm({ onSubmit, disabled }: { onSubmit: (text: string, tone?: string, format?: string) => void; disabled?: boolean }) {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('professional');
  const [format, setFormat] = useState('pdf');

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (text.trim()) onSubmit(text, tone, format); };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Describe what you want to create..." rows={4} disabled={disabled} />
      <div style={{display:'flex',gap:'var(--space-3)',marginTop:'var(--space-3)'}}>
        <Select options={TONES} value={tone} onChange={setTone} placeholder="Tone" />
        <Select options={FORMATS} value={format} onChange={setFormat} placeholder="Format" />
      </div>
      <button type="submit" disabled={disabled || !text.trim()}>Generate Document</button>
    </form>
  );
}
