'use client';

import { useState } from 'react';
import Link from 'next/link';

const ACTIONS = [
  { label: 'Generate Document', href: '/generate', keywords: ['generate', 'create', 'write', 'document'] },
  { label: 'Convert File', href: '/convert', keywords: ['convert', 'change format', 'transform'] },
  { label: 'Translate', href: '/translate', keywords: ['translate', 'language'] },
  { label: 'Voice to Document', href: '/voice', keywords: ['voice', 'record', 'speak', 'audio'] },
  { label: 'Extract Text', href: '/extract-text-from-pdf', keywords: ['extract', 'ocr', 'text from'] },
  { label: 'Merge PDF', href: '/merge-pdf', keywords: ['merge', 'combine', 'join'] },
  { label: 'Split PDF', href: '/split-pdf', keywords: ['split', 'separate', 'divide'] },
  { label: 'Compress PDF', href: '/compress-pdf', keywords: ['compress', 'reduce size', 'shrink'] },
  { label: 'Change Style', href: '/change-style', keywords: ['style', 'format', 'reformat'] },
];

export function ActionsSearch() {
  const [query, setQuery] = useState('');

  const filtered = query
    ? ACTIONS.filter((a) =>
        a.keywords.some((kw) => kw.includes(query.toLowerCase())) ||
        a.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search actions..."
      />
      {query && filtered.length === 0 && <p>No matching actions found.</p>}
      {filtered.length > 0 && (
        <ul>
          {filtered.map((action) => (
            <li key={action.href}>
              <Link href={action.href}>{action.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}