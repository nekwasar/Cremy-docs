'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormInput } from '../../_components/FormInput';
import s from '@/styles/pages/auth.module.css';
import b from '@/styles/components/Button.module.css';
import f from '@/styles/components/FormGroup.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,password}) });
      const data = await response.json();
      if (data.success) { router.push('/dashboard'); }
      else { setError(data.error?.message || 'Registration failed'); }
    } catch { setError('An error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h1 className={s.title}>Create Account</h1>
        <form onSubmit={handleSubmit} className={s.form}>
          {error && <div className={f.error} style={{marginBottom:'var(--space-4)'}}>{error}</div>}
          <FormInput label="Name" name="name" value={name} onChange={setName} required />
          <FormInput label="Email" name="email" type="email" value={email} onChange={setEmail} required />
          <FormInput label="Password" name="password" type="password" value={password} onChange={setPassword} required />
          <button type="submit" disabled={loading} className={`${b.btn} ${b.soft} ${b.btnFull} ${s.submitBtn}`}>
            Create Account
          </button>
        </form>
        <p className={s.footerLink}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
