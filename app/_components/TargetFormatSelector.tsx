'use client';

import i from '@/styles/components/Input.module.css';
import sl from '@/styles/components/Select.module.css';

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

export function TargetFormatSelector({ sourceFormat, value, onChange, disabled = false }: TargetFormatSelectorProps) {
  const formats = Object.keys(FORMAT_LABELS).filter((f) => f !== sourceFormat);

  return (
    <div>
      <label className={i.label}>Convert to:</label>
      <select
        className={`${i.input} ${i.soft} ${sl.trigger} ${sl.soft}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {formats.map((format) => (
          <option key={format} value={format}>
            {FORMAT_LABELS[format] || format.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}