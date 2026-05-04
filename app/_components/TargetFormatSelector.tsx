'use client';

import { Select } from './Select';

interface TargetFormatSelectorProps {
  sourceFormat: string;
  value: string;
  onChange: (format: string) => void;
  disabled?: boolean;
}

const FORMAT_LABELS: Record<string, string> = {
  pdf: 'PDF', docx: 'DOCX', doc: 'DOC', odt: 'ODT', rtf: 'RTF', txt: 'TXT',
  pptx: 'PPTX', ppt: 'PPT', odp: 'ODP',
  xlsx: 'XLSX', xls: 'XLS', ods: 'ODS', csv: 'CSV',
  epub: 'EPUB', mobi: 'MOBI', azw: 'AZW',
  html: 'HTML', md: 'Markdown',
  jpg: 'JPG', png: 'PNG', webp: 'WEBP',
};

export function TargetFormatSelector({ sourceFormat, value, onChange, disabled }: TargetFormatSelectorProps) {
  const opts = Object.keys(FORMAT_LABELS)
    .filter(f => f !== sourceFormat)
    .map(f => ({ value: f, label: FORMAT_LABELS[f] || f.toUpperCase() }));

  return (
    <div>
      <Select options={opts} value={value} onChange={onChange} placeholder="Convert to..." disabled={disabled} />
    </div>
  );
}
