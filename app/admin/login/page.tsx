'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/admin-auth';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginAdmin(username, password);
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:420,margin:'0 auto',padding:'var(--space-16) var(--space-6)',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
      <div style={{width:'100%'}}>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)',textAlign:'center'}}>Admin Login</h1>
        <form onSubmit={handleSubmit} className={`${c.card} ${c.soft}`}>
          <div className={i.group}>
            <label className={i.label}>Username</label>
            <input className={`${i.input} ${i.soft}`} value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className={i.group}>
            <label className={i.label}>Password</label>
            <input className={`${i.input} ${i.soft}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{color:'var(--color-error)',fontSize:'var(--text-sm)',marginBottom:'var(--space-4)'}}>{error}</p>}
          <button className={`${b.btn} ${b.soft} ${b.btnFull}`} type="submit" disabled={loading}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
