'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface FooterSectionProps {}

export function FooterSection({}: FooterSectionProps): ReactNode {
  const links = {
    product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Templates', href: '/templates' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  return (
    <footer className="footer-section">
      <div className="footer-links">
        <div className="footer-column">
          <h4>Product</h4>
          <ul>
            {links.product.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            {links.company.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            {links.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Cremy Docs. All rights reserved.</p>
      </div>
    </footer>
  );
}