import { Suspense } from 'react';
import Link from 'next/link';
import sb from '@/styles/components/Sidebar.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <aside className={`${sb.sidebar} ${sb.soft}`}>
        <div style={{padding:'var(--space-4) var(--space-5)',borderBottom:'1px solid var(--color-border)',fontWeight:'var(--weight-semibold)',fontSize:'var(--text-sm)'}}>Tools</div>
        <Link href="/dashboard" className={sb.softItem}>Dashboard</Link>
        <Link href="/generate" className={sb.softItem}>Generate</Link>
        <Link href="/convert" className={sb.softItem}>Convert</Link>
        <Link href="/translate" className={sb.softItem}>Translate</Link>
        <Link href="/voice" className={sb.softItem}>Voice</Link>
        <Link href="/extract-text-from-pdf" className={sb.softItem}>Extract Text</Link>
        <Link href="/merge-pdf" className={sb.softItem}>Merge PDF</Link>
        <Link href="/split-pdf" className={sb.softItem}>Split PDF</Link>
        <Link href="/compress-pdf" className={sb.softItem}>Compress</Link>
        <Link href="/change-style" className={sb.softItem}>Change Style</Link>
        <Link href="/credits" className={sb.softItem}>Credits</Link>
        <Link href="/settings" className={sb.softItem}>Settings</Link>
      </aside>
      <div style={{flex:1,minWidth:0}}>
        <Suspense fallback={null}>
          <main>{children}</main>
        </Suspense>
      </div>
    </div>
  );
}