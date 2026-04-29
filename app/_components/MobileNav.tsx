'use client';

import { useState } from 'react';
import Link from 'next/link';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'} Menu
      </button>
      {isOpen && (
        <nav>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/templates">Templates</Link></li>
            <li><Link href="/generate">Generate</Link></li>
            <li><Link href="/convert">Convert</Link></li>
            <li><Link href="/translate">Translate</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/settings">Settings</Link></li>
            <li><Link href="/credits">Credits</Link></li>
          </ul>
        </nav>
      )}
    </div>
  );
}