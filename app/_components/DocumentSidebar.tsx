'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useDocumentStore } from '../../src/store';

interface DocumentSidebarProps {}

export function DocumentSidebar({}: DocumentSidebarProps): ReactNode {
  const { documentHistory } = useDocumentStore();
  const [isOpen, setIsOpen] = useState(false);

  const recentDocs = documentHistory.slice(0, 10);

  return (
    <div className={`document-sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '<' : '>'}
      </button>
      {isOpen && (
        <div>
          <h3>Recent Documents</h3>
          <ul>
            {recentDocs.length === 0 ? (
              <li>No recent documents</li>
            ) : (
              recentDocs.map((doc) => (
                <li key={doc.id}>
                  <Link href={`/preview?id=${doc.id}`}>{doc.title}</Link>
                  <span>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
          <Link href="/dashboard">
            View All
          </Link>
        </div>
      )}
    </div>
  );
}