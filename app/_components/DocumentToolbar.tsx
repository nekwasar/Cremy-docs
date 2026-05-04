'use client';

import { Select } from './Select';

interface DownloadAction { documentId: string; disabled?: boolean }

const OPTS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'md', label: 'Markdown' },
];

export function DocumentToolbar({ onDownload }: { onDownload: (format: string) => void }) {
  return (
    <div>
      <Select options={OPTS} value="" onChange={onDownload} placeholder="Download" />
    </div>
  );
}
