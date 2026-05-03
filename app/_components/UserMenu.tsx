'use client';

import Link from 'next/link';
import { useUserStore } from '@/store/user-store';

export function UserMenu() {
  const { user, logout } = useUserStore();

  return (
    <div>
      {user ? (
        <div>
          <span>{user.name || user.email}</span>
          <ul>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/settings">Settings</Link></li>
            <li><Link href="/account/subscription">Subscription</Link></li>
            <li><Link href="/account/billing">Billing</Link></li>
            <li><button onClick={() => logout()}>Logout</button></li>
          </ul>
        </div>
      ) : (
        <div>
          <Link href="/login">Login</Link>
          <Link href="/register">Sign Up</Link>
        </div>
      )}
    </div>
  );
}