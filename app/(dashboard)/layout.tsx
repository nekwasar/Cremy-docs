import { Suspense } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>
        <Link href="/">Cremy Docs</Link>
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/generate">Generate</Link>
          <Link href="/convert">Convert</Link>
          <Link href="/translate">Translate</Link>
          <Link href="/voice">Voice</Link>
          <Link href="/extract-text-from-pdf">Extract Text</Link>
          <Link href="/merge-pdf">Merge PDF</Link>
          <Link href="/split-pdf">Split PDF</Link>
          <Link href="/compress-pdf">Compress</Link>
          <Link href="/change-style">Change Style</Link>
          <Link href="/credits">Credits</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </aside>
      <div>
        <header>
          <div>
            <span>💰</span>
            
          </div>
          <div>
            <button>Account</button>
          </div>
        </header>
        <Suspense fallback={null}>
          <main>{children}</main>
        </Suspense>
      </div>
    </div>
  );
}