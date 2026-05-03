'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../_components/AdminSidebar';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function AdminApiKeysPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [maskedKey, setMaskedKey] = useState('');
  const [newKey, setNewKey] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [stats, setStats] = useState({ requestsToday: 0, requestsMonth: 0, lastUsed: '', status: '' });

  useEffect(() => {
    fetch('/api/admin/api-keys')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setApiKey(data.data.key);
          setMaskedKey(data.data.masked);
          setStats(data.data.stats || stats);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddKey = async () => {
    const res = await fetch('/api/admin/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data.success) {
      setNewKey(data.data.key);
      setShowNew(true);
    }
  };

  const handleRemoveKey = async () => {
    if (!confirm('Are you sure? This will break all AI functionality.')) return;
    await fetch('/api/admin/api-keys', { method: 'DELETE' });
    setApiKey(null);
    setMaskedKey('');
  };

  return (
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>API Key Management</h1>

        {apiKey ? (
          <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
            <p style={{fontSize:'var(--text-base)',marginBottom:'var(--space-2)',fontFamily:'var(--font-mono)'}}>Current Key: {maskedKey}</p>
            <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>Status: {stats.status}</p>
            <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)',marginBottom:'var(--space-4)'}}>Last Used: {stats.lastUsed || 'Never'}</p>
            <button className={`${b.btn} ${b.raw}`} onClick={handleRemoveKey}>Remove Key</button>
          </div>
        ) : (
          <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
            <p style={{fontSize:'var(--text-base)',color:'var(--color-text-secondary)'}}>No API key configured. Add one to enable AI features.</p>
          </div>
        )}

        <div style={{marginBottom:'var(--space-6)'}}>
          <button className={`${b.btn} ${b.soft}`} onClick={handleAddKey}>Add New API Key</button>
        </div>

        {showNew && newKey && (
          <div className={`${c.card} ${c.soft}`}>
            <p style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',marginBottom:'var(--space-3)'}}>New API Key (copy now &mdash; won&apos;t be shown again):</p>
            <pre style={{background:'var(--color-input-bg)',padding:'var(--space-3)',borderRadius:'var(--radius-xs)',fontFamily:'var(--font-mono)',fontSize:'var(--text-sm)',marginBottom:'var(--space-3)',overflowX:'auto'}}>{newKey}</pre>
            <button className={`${b.btn} ${b.raw}`} onClick={() => navigator.clipboard.writeText(newKey)}>Copy</button>
          </div>
        )}
      </div>
    </div>
  );
}
