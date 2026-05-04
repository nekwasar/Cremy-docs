'use client';

import { Select } from './Select';

const OPTS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'html', label: 'HTML' },
];

export function PreviewToolbar({ onDownload }: { onDownload: (format: string) => void }) {
  return (
    <div style={{display:'flex',gap:'var(--space-3)',alignItems:'center'}}>
      <Select options={OPTS} value="" onChange={onDownload} placeholder="Download" />
    </div>
  );
}
