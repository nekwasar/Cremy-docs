'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <nav>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <Link href="/api/auth/logout">Logout</Link>
      </div>
    </nav>
  );
}