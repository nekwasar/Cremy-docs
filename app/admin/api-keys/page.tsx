'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../_components/AdminSidebar';

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
    <div>
      <AdminSidebar />
      <div>
        <h1>API Key Management</h1>

        {apiKey ? (
          <div>
            <p>Current Key: {maskedKey}</p>
            <p>Status: {stats.status}</p>
            <p>Last Used: {stats.lastUsed || 'Never'}</p>
            <button onClick={handleRemoveKey}>Remove Key</button>
          </div>
        ) : (
          <p>No API key configured. Add one to enable AI features.</p>
        )}

        <div>
          <button onClick={handleAddKey}>Add New API Key</button>
        </div>

        {showNew && newKey && (
          <div>
            <p>New API Key (copy now - won&apos;t be shown again):</p>
            <pre>{newKey}</pre>
            <button onClick={() => navigator.clipboard.writeText(newKey)}>Copy</button>
          </div>
        )}
      </div>
    </div>
  );
}