'use client';

import { useEffect, useState } from 'react';
import { AdminSidebar } from '../_components/AdminSidebar';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <AdminSidebar />
      <div>
        <h1>Admin Dashboard</h1>
        <div>
          <div>
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div>
            <h3>Documents</h3>
            <p>{stats.totalDocuments}</p>
          </div>
          <div>
            <h3>Revenue</h3>
            <p>${stats.totalRevenue}</p>
          </div>
          <div>
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
          </div>
        </div>
        <div>
          <h2>Quick Links</h2>
          <Link href="/admin/api-keys">API Keys</Link>
          <Link href="/admin/pricing">Pricing</Link>
          <Link href="/admin/settings">Settings</Link>
          <Link href="/admin/email">Email Campaigns</Link>
          <Link href="/admin/analytics">Analytics</Link>
          <Link href="/admin/blog">Blog Posts</Link>
        </div>
      </div>
    </div>
  );
}