'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user-store';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalDocuments: number;
  totalCredits: number;
  activeSubscriptions: number;
}

export default function AdminPage() {
  const { user } = useUserStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <Link href="/dashboard">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>

      {loading ? (
        <p>Loading...</p>
      ) : stats ? (
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Documents</h3>
            <p>{stats.totalDocuments}</p>
          </div>
          <div className="stat-card">
            <h3>Credits in System</h3>
            <p>{stats.totalCredits}</p>
          </div>
          <div className="stat-card">
            <h3>Active Subscriptions</h3>
            <p>{stats.activeSubscriptions}</p>
          </div>
        </div>
      ) : (
        <p>Unable to load stats</p>
      )}

      <section className="admin-sections">
        <h2>Quick Links</h2>
        <div className="admin-links">
          <Link href="/admin/users">Manage Users</Link>
          <Link href="/admin/documents">Manage Documents</Link>
          <Link href="/admin/api-keys">API Keys</Link>
          <Link href="/admin/templates">Manage Templates</Link>
        </div>
      </section>
    </div>
  );
}