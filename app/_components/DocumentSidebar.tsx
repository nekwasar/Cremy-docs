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
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '<' : '>'}
      </button>
      {isOpen && (
        <div className="sidebar-content">
          <h3>Recent Documents</h3>
          <ul className="document-list">
            {recentDocs.length === 0 ? (
              <li className="no-documents">No recent documents</li>
            ) : (
              recentDocs.map((doc) => (
                <li key={doc.id}>
                  <Link href={`/preview?id=${doc.id}`}>{doc.title}</Link>
                  <span className="doc-date">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
          <Link href="/dashboard" className="view-all">
            View All
          </Link>
        </div>
      )}
    </div>
  );
}