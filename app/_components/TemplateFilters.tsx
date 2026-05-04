'use client';

import { Select } from './Select';

interface Props {
  onSort: (sort: string) => void;
  onFormat: (format: string) => void;
  onPremium: (premium: boolean | null) => void;
  onClear: () => void;
}

const SORT_OPTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name A-Z' },
];
const FORMAT_OPTS = [
  { value: '', label: 'All Formats' },
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'md', label: 'Markdown' },
];
const PREMIUM_OPTS = [
  { value: '', label: 'All' },
  { value: 'false', label: 'Free' },
  { value: 'true', label: 'Premium' },
];

export function TemplateFilters({ onSort, onFormat, onPremium, onClear }: Props) {
  return (
    <div style={{display:'flex',gap:'var(--space-3)',alignItems:'center'}}>
      <Select options={SORT_OPTS} onChange={onSort} value="" placeholder="Sort" />
      <Select options={FORMAT_OPTS} onChange={onFormat} value="" placeholder="Format" />
      <Select options={PREMIUM_OPTS} onChange={(v) => onPremium(v === '' ? null : v === 'true')} value="" placeholder="Type" />
      <button onClick={onClear} style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)',background:'none',border:'none',cursor:'pointer'}}>Clear</button>
    </div>
  );
}
