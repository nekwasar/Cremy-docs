'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { validatePasswordComplexity } from '@/lib/password-complexity';

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
    <div>
      <h1>Create Admin Account</h1>
      {token ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {complexity && (
              <div>
                <p>Strength: {complexity.strength}</p>
                {complexity.errors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            )}
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <p>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>
      ) : (
        <p>Invalid or missing invite token.</p>
      )}
    </div>
  );
}