'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import sb from '@/styles/components/Sidebar.module.css';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/api-keys', label: 'API Keys' },
    { href: '/admin/pricing', label: 'Pricing' },
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/email', label: 'Email' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/formats', label: 'Formats' },
  ];

  return (
    <nav className={`${sb.sidebar} ${sb.soft}`}>
      <div style={{padding:'var(--space-6) var(--space-5)',borderBottom:'1px solid var(--color-border)',fontWeight:'var(--weight-semibold)',fontSize:'var(--text-sm)'}}>Admin</div>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={`${sb.softItem} ${pathname === link.href ? sb.softActive : ''}`}>
          {link.label}
        </Link>
      ))}
      <div className={sb.toggle}>
        <Link href="/api/auth/logout" style={{fontSize:'var(--text-xs)'}}>Logout</Link>
      </div>
    </nav>
  );
}