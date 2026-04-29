'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user-store';
import Link from 'next/link';

interface Document {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, credits, fetchUser } = useUserStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents?limit=10');
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data.documents);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Credits</h3>
          <p className="stat-value">{credits}</p>
          <Link href="/credits" className="stat-link">Add more</Link>
        </div>
        <div className="stat-card">
          <h3>Documents</h3>
          <p className="stat-value">{documents.length}</p>
          <Link href="/generate" className="stat-link">Create new</Link>
        </div>
        <div className="stat-card">
          <h3>Account</h3>
          <p className="stat-value">{user?.role || 'free'}</p>
          <Link href="/settings" className="stat-link">Manage</Link>
        </div>
      </div>

      <section className="recent-docs">
        <h2>Recent Documents</h2>
        {loading ? (
          <p>Loading...</p>
        ) : documents.length > 0 ? (
          <ul className="doc-list">
            {documents.map((doc) => (
              <li key={doc._id} className="doc-item">
                <Link href={`/preview?doc=${doc._id}`}>
                  <span>{doc.title}</span>
                  <span className="doc-status">{doc.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents yet. <Link href="/generate">Create one</Link></p>
        )}
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link href="/generate" className="btn-action">Generate Document</Link>
          <Link href="/convert" className="btn-action">Convert File</Link>
          <Link href="/templates" className="btn-action">Browse Templates</Link>
        </div>
      </section>
    </div>
  );
}