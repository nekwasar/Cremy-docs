'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useUserStore } from '../../src/store';

interface HeaderUserMenuProps {}

export function HeaderUserMenu({}: HeaderUserMenuProps): ReactNode {
  const { user, isAuthenticated, logout, credits } = useUserStore();

  if (!isAuthenticated) {
    return (
      <div>
        <Link href="/login">Login</Link>
        <Link href="/register">Sign Up</Link>
      </div>
    );
  }

  return (
    <div>
      <div>
        <span>💰</span>
        <span>{credits}</span>
      </div>
      <div>
        <button>{user?.name || 'User'}</button>
        <div>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/settings">Settings</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}