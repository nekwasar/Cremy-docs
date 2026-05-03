'use client';

import Link from 'next/link';

interface Document {
  id: string;
  title: string;
  createdAt: string;
  status: string;
  wordCount: number;
}

interface DocumentHistoryProps {
  documents: Document[];
  isLoading: boolean;
  onSearch: (query: string) => void;
  onSort: (sort: string) => void;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

export function DocumentHistory({
  documents,
  isLoading,
  onSearch,
  onSort,
  total,
  page,
  onPageChange,
}: DocumentHistoryProps) {
  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search documents..."
          onChange={(e) => onSearch(e.target.value)}
        />
        <select onChange={(e) => onSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
      {isLoading ? null : documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link href={`/preview?doc=${doc.id}`}>
                <span>{doc.title || 'Untitled'}</span>
                <span>{doc.wordCount} words</span>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                <span>{doc.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div>
          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}