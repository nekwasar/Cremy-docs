'use client';

import Link from 'next/link';
import { Select } from './Select';

interface Document { id: string; title: string; createdAt: string; status: string; wordCount: number; }
interface Props { documents: Document[]; isLoading: boolean; onSearch: (q: string) => void; onSort: (s: string) => void; total: number; page: number; onPageChange: (p: number) => void; }

const SORT_OPTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name A-Z' },
];

export function DocumentHistory({ documents, isLoading, onSearch, onSort, total, page, onPageChange }: Props) {
  return (
    <div>
      <div style={{display:'flex',gap:'var(--space-3)',marginBottom:'var(--space-4)',flexWrap:'wrap'}}>
        <input type="text" placeholder="Search documents..." onChange={e => onSearch(e.target.value)} />
        <Select options={SORT_OPTS} value="" onChange={onSort} placeholder="Sort" />
      </div>
      {isLoading ? null : documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>
              <Link href={`/preview?doc=${doc.id}`}>{doc.title}</Link>
              <span>{doc.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
