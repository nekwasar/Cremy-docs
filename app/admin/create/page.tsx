'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { validatePasswordComplexity } from '@/lib/password-complexity';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function AdminCreatePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const complexity = password ? validatePasswordComplexity(password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (complexity && !complexity.valid) {
      setError(complexity.errors.join('. '));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/login');
      } else {
        setError(data.error || 'Failed to create admin');
      }
    } catch {
      setError('Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:480,margin:'0 auto',padding:'var(--space-16) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)',textAlign:'center'}}>Create Admin Account</h1>
      {token ? (
        <form onSubmit={handleSubmit} className={`${c.card} ${c.soft}`}>
          <div className={i.group}>
            <label className={i.label}>Username</label>
            <input className={`${i.input} ${i.soft}`} value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className={i.group}>
            <label className={i.label}>Password</label>
            <input className={`${i.input} ${i.soft}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {complexity && (
              <div style={{marginTop:'var(--space-2)'}}>
                <p style={{fontSize:'var(--text-xs)',fontWeight:'var(--weight-medium)',marginBottom:'var(--space-1)'}}>Strength: {complexity.strength}</p>
                {complexity.errors.map((err, idx) => (
                  <p key={idx} style={{fontSize:'var(--text-xs)',color:'var(--color-error)'}}>{err}</p>
                ))}
              </div>
            )}
          </div>
          <div className={i.group}>
            <label className={i.label}>Confirm Password</label>
            <input className={`${i.input} ${i.soft}`} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <p style={{color:'var(--color-error)',fontSize:'var(--text-sm)',marginBottom:'var(--space-4)'}}>{error}</p>}
          <button className={`${b.btn} ${b.soft} ${b.btnFull}`} type="submit" disabled={loading}>
            Create Admin Account
          </button>
        </form>
      ) : (
        <div className={`${c.card} ${c.soft}`}>
          <p style={{fontSize:'var(--text-base)',color:'var(--color-text-secondary)',textAlign:'center'}}>Invalid or missing invite token.</p>
        </div>
      )}
    </div>
  );
}
