'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FormInput } from '../../_components/FormInput';
import s from '@/styles/pages/auth.module.css';
import b from '@/styles/components/Button.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email}) });
      if (res.ok) { setStatus('sent'); }
      else { const data = await res.json(); setError(data.error || 'Something went wrong'); setStatus('error'); }
    } catch { setError('Network error. Please try again.'); setStatus('error'); }
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h1 className={s.title}>Reset Password</h1>
        {status === 'sent' ? (
          <div>
            <p style={{marginBottom:'var(--space-6)',fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>If an account with that email exists, we have sent a password reset link.</p>
            <Link href="/login" className={s.footerLink}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={s.form}>
            <p style={{marginBottom:'var(--space-4)',fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>Enter your email and we will send you a reset link.</p>
            <FormInput label="Email" name="email" type="email" value={email} onChange={setEmail} required placeholder="you@example.com" />
            {error && <p style={{marginBottom:'var(--space-4)',fontSize:'var(--text-xs)'}}>{error}</p>}
            <button type="submit" disabled={status === 'loading'} className={`${b.btn} ${b.soft} ${b.btnFull} ${s.submitBtn}`}>
              Send Reset Link
            </button>
            <p className={s.footerLink}>
              <Link href="/login">Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
