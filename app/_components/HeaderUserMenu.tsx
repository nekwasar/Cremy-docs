'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useUserStore } from '../../src/store';

interface HeaderUserMenuProps {}

export function HeaderUserMenu({}: HeaderUserMenuProps): ReactNode {
  const { user, isAuthenticated, logout, credits } = useUserStore();

  if (!isAuthenticated) {
    return (
      <div className="header-user-menu">
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Sign Up</Link>
      </div>
    );
  }

  return (
    <div className="header-user-menu">
      <div className="credits-display">
        <span className="credits-icon">💰</span>
        <span className="credits-value">{credits}</span>
      </div>
      <div className="user-dropdown">
        <button className="user-name">{user?.name || 'User'}</button>
        <div className="dropdown-menu">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/settings">Settings</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}