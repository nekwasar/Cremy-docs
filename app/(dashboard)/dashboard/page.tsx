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
    <div>
      <h1>Dashboard</h1>

      <div>
        <div>
          <h3>Credits</h3>
          <p>{credits}</p>
          <Link href="/credits">Add more</Link>
        </div>
        <div>
          <h3>Documents</h3>
          <p>{documents.length}</p>
          <Link href="/generate">Create new</Link>
        </div>
        <div>
          <h3>Account</h3>
          <p>{user?.role || 'free'}</p>
          <Link href="/settings">Manage</Link>
        </div>
      </div>

      <section>
        <h2>Recent Documents</h2>
        {loading ? (
          <p>Loading...</p>
        ) : documents.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc._id}>
                <Link href={`/preview?doc=${doc._id}`}>
                  <span>{doc.title}</span>
                  <span>{doc.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents yet. <Link href="/generate">Create one</Link></p>
        )}
      </section>

      <section>
        <h2>Quick Actions</h2>
        <div>
          <Link href="/generate">Generate Document</Link>
          <Link href="/convert">Convert File</Link>
          <Link href="/templates">Browse Templates</Link>
        </div>
      </section>
    </div>
  );
}