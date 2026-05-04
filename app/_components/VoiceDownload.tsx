'use client';

import { Select } from './Select';

const OPTS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
];

export function VoiceDownload({ documentId }: { documentId: string }) {
  const handleDownload = async (format: string) => {
    const response = await fetch(`/api/documents/${documentId}/download?format=${format}`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `document.${format}`; a.click();
    URL.revokeObjectURL(url);
  };

  return <Select options={OPTS} value="" onChange={handleDownload} placeholder="Download" />;
}
