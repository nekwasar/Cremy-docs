'use client';

import { Select } from './Select';
import i from '@/styles/components/Input.module.css';

const SORT_OPTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'format', label: 'By Format' },
];
const FILTER_OPTS = [
  { value: '', label: 'All Formats' },
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'md', label: 'Markdown' },
];

export function DocumentFilterBar({ onSearch, onSort, onFilter }: { onSearch: (q: string) => void; onSort: (s: string) => void; onFilter: (f: string) => void }) {
  return (
    <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap'}}>
      <input type="text" placeholder="Search documents..." onChange={e => onSearch(e.target.value)} className={`${i.input} ${i.soft}`} style={{maxWidth:'280px'}} />
      <Select options={SORT_OPTS} value="" onChange={onSort} placeholder="Sort" />
      <Select options={FILTER_OPTS} value="" onChange={onFilter} placeholder="Filter" />
    </div>
  );
}
