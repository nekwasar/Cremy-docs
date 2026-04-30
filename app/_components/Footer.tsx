'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer>
      <div>
        <div>
          <p>Cremy Docs — AI-powered document tools.</p>
        </div>
        <div>
          <h4>Tools</h4>
          <ul>
            <li><Link href="/generate">Generate</Link></li>
            <li><Link href="/convert">Convert</Link></li>
            <li><Link href="/translate">Translate</Link></li>
            <li><Link href="/voice">Voice</Link></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div>
        <p>{new Date().getFullYear()} Cremy Docs. All rights reserved.</p>
      </div>
    </footer>
  );
}