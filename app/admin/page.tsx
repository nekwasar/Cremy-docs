'use client';

import { useEffect, useState } from 'react';
import { AdminSidebar } from '../_components/AdminSidebar';
import Link from 'next/link';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

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
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Admin Dashboard</h1>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',gap:'var(--space-4)',marginBottom:'var(--space-8)'}}>
          <div className={`${c.card} ${c.soft}`}>
            <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>Total Users</h3>
            <p style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)'}}>{stats.totalUsers}</p>
          </div>
          <div className={`${c.card} ${c.soft}`}>
            <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>Documents</h3>
            <p style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)'}}>{stats.totalDocuments}</p>
          </div>
          <div className={`${c.card} ${c.soft}`}>
            <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>Revenue</h3>
            <p style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)'}}>${stats.totalRevenue}</p>
          </div>
          <div className={`${c.card} ${c.soft}`}>
            <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>Active Users</h3>
            <p style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)'}}>{stats.activeUsers}</p>
          </div>
        </div>
        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Quick Links</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',gap:'var(--space-3)'}}>
          <Link href="/admin/api-keys"><button className={`${b.btn} ${b.raw} ${b.btnFull}`}>API Keys</button></Link>
          <Link href="/admin/pricing"><button className={`${b.btn} ${b.raw} ${b.btnFull}`}>Pricing</button></Link>
          <Link href="/admin/settings"><button className={`${b.btn} ${b.raw} ${b.btnFull}`}>Settings</button></Link>
          <Link href="/admin/email"><button className={`${b.btn} ${b.raw} ${b.btnFull}`}>Email Campaigns</button></Link>
          <Link href="/admin/analytics"><button className={`${b.btn} ${b.raw} ${b.btnFull}`}>Analytics</button></Link>
          <Link href="/admin/blog"><button className={`${b.btn} ${b.raw} ${b.btnFull}`}>Blog Posts</button></Link>
        </div>
      </div>
    </div>
  );
}
