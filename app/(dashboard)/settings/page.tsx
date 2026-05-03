'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/user-store';
import { useSettingsStore } from '@/store/settings-store';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function SettingsPage() {
  const { user, updateUser } = useUserStore();
  const { theme, setTheme } = useSettingsStore();
  const [name, setName] = useState(user?.name || '');

  const handleSave = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data.success) {
        updateUser(data.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <div>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Account</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'0 var(--space-2)'}}>/</span>
        <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>Settings</span>
      </div>
      <h1>Settings</h1>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <h2 className={c.header}>Profile</h2>
        <div className={i.group}>
          <label className={i.label}>Name</label>
          <input
            className={i.soft}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={i.group}>
          <label className={i.label}>Email</label>
          <input
            className={i.soft}
            type="email"
            value={user?.email || ''}
            disabled
          />
        </div>
        <button className={b.soft} onClick={handleSave}>Save</button>
      </div>

      <div className={c.soft} style={{marginBottom:'var(--space-4)'}}>
        <h2 className={c.header}>Appearance</h2>
        <div className={i.group}>
          <label className={i.label}>Theme</label>
          <select
            className={i.soft}
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className={c.soft}>
        <h2 className={c.header}>Danger Zone</h2>
        <button className={b.soft} style={{background:'var(--color-error)',borderColor:'var(--color-error)'}}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
