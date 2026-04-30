'use client';

import { useUserStore } from '@/store/user-store';
import { notFound } from 'next/navigation';

export default function MailcraftPage() {
  const { user } = useUserStore();

  if (!user || user.role !== 'admin') {
    return notFound();
  }

  return (
    <div>
      <h1>Mailcraft — AI Email Assistant</h1>
      <p>Admin-only tool for generating and editing email templates with AI.</p>
    </div>
  );
}