'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/user-store';

export function Navbar() {
  const pathname = usePathname();
  const { user, credits } = useUserStore();

  return (
    <nav>
      <div>
        <Link href="/">Cremy Docs</Link>
      </div>
      <div>
        <div>
          <span>{credits} credits</span>
        </div>
        <div>
          {user ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}