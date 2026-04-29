'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/user-store';
import { useUIStore } from '@/store/ui-store';

export default function SettingsPage() {
  const { user, updateUser } = useUserStore();
  const { theme, setTheme } = useUIStore();
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
    <div className="settings-page">
      <h1>Settings</h1>

      <section>
        <h2>Profile</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={user?.email || ''} disabled />
        </div>
        <button onClick={handleSave}>Save</button>
      </section>

      <section>
        <h2>Appearance</h2>
        <div className="form-group">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </section>

      <section>
        <h2>Danger Zone</h2>
        <button className="btn-danger">Delete Account</button>
      </section>
    </div>
  );
}