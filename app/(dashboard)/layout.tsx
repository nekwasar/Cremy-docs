import { Suspense } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Cremy Docs</Link>
        <nav className="sidebar-nav">
          <Link href="/dashboard" className="sidebar-link">Dashboard</Link>
          <Link href="/generate" className="sidebar-link">Generate</Link>
          <Link href="/convert" className="sidebar-link">Convert</Link>
          <Link href="/translate" className="sidebar-link">Translate</Link>
          <Link href="/voice" className="sidebar-link">Voice</Link>
          <Link href="/extract-text-from-pdf" className="sidebar-link">Extract Text</Link>
          <Link href="/merge-pdf" className="sidebar-link">Merge PDF</Link>
          <Link href="/split-pdf" className="sidebar-link">Split PDF</Link>
          <Link href="/compress-pdf" className="sidebar-link">Compress</Link>
          <Link href="/change-style" className="sidebar-link">Change Style</Link>
          <Link href="/credits" className="sidebar-link">Credits</Link>
          <Link href="/settings" className="sidebar-link">Settings</Link>
        </nav>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="credit-balance">
            <span className="credit-icon">💰</span>
            <span className="credit-amount">Loading...</span>
          </div>
          <div className="user-menu">
            <button className="user-menu-btn">Account</button>
          </div>
        </header>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <main className="dashboard-content">{children}</main>
        </Suspense>
      </div>
    </div>
  );
}