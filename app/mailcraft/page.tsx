'use client';

import { useUserStore } from '@/store/user-store';
import { notFound } from 'next/navigation';
import c from '@/styles/components/Card.module.css';

export default function MailcraftPage() {
  const { user } = useUserStore();

  if (!user || user.role !== 'admin') {
    return notFound();
  }

  return (
    <div style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <div className={c.card} style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <h1>Mailcraft — AI Email Assistant</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
          Admin-only tool for generating and editing email templates with AI.
        </p>
      </div>
    </div>
  );
}
