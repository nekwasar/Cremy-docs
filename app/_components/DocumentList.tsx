'use client';

import Link from 'next/link';

interface DocumentListProps {
  documents: Array<{
    id: string;
    title: string;
    format: string;
    wordCount: number;
    createdAt: string;
  }>;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
}

export function DocumentList({ documents, onDelete, onRegenerate }: DocumentListProps) {
  if (documents.length === 0) {
    return <p>No documents yet. <Link href="/generate">Create one</Link></p>;
  }

  return (
    <ul>
      {documents.map((doc) => (
        <li key={doc.id}>
          <Link href={`/preview?doc=${doc.id}`}>
            <strong>{doc.title || 'Untitled'}</strong>
          </Link>
          <span>{doc.format}</span>
          <span>{doc.wordCount} words</span>
          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
          <div>
            <button onClick={() => onRegenerate(doc.id)}>Regenerate</button>
            <button onClick={() => onDelete(doc.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}