'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../_components/AdminSidebar';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.data);
      });
  }, []);

  const update = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminSidebar />
      <div>
        <h1>System Settings</h1>

        <h2>Free Credits</h2>
        <div>
          <label>Anonymous user credits: <input type="number" value={settings.anonymousCredits || 5} onChange={(e) => update('anonymousCredits', parseInt(e.target.value))} /></label>
        </div>
        <div>
          <label>Registered user credits: <input type="number" value={settings.registeredCredits || 10} onChange={(e) => update('registeredCredits', parseInt(e.target.value))} /></label>
        </div>

        <h2>Credit Costs (All configurable, can be FREE)</h2>
        {[
          { key: 'genPerWords', label: 'Generation: 1 credit per X words', def: 100 },
          { key: 'editPerEdits', label: 'AI Editing: 1 credit per X edits', def: 10 },
          { key: 'translatePerWords', label: 'Translation: 1 credit per X words', def: 50 },
          { key: 'ocrPerWords', label: 'OCR: 1 credit per X words', def: 50 },
          { key: 'stylePerWords', label: 'Change Style: 1 credit per X words', def: 100 },
          { key: 'imageCost', label: 'Image Add: credits per image', def: 1 },
        ].map(({ key, label, def }) => (
          <div key={key}>
            <label>{label}: <input type="number" value={settings[key] ?? def} onChange={(e) => update(key, parseInt(e.target.value) || 0)} /></label>
            <label>
              <input type="checkbox" checked={settings[`${key}_free`] || false} onChange={(e) => update(`${key}_free`, e.target.checked)} />
              FREE
            </label>
          </div>
        ))}

        <h2>Credit Packs</h2>
        {(settings.creditPacks || [{ credits: 100, price: 10 }, { credits: 500, price: 40 }]).map((pack: any, i: number) => (
          <div key={i}>
            <input type="number" value={pack.credits} onChange={(e) => {
              const packs = [...(settings.creditPacks || [{ credits: 100, price: 10 }, { credits: 500, price: 40 }])];
              packs[i] = { ...packs[i], credits: parseInt(e.target.value) };
              update('creditPacks', packs);
            }} /> credits: $
            <input type="number" value={pack.price} onChange={(e) => {
              const packs = [...(settings.creditPacks || [{ credits: 100, price: 10 }, { credits: 500, price: 40 }])];
              packs[i] = { ...packs[i], price: parseFloat(e.target.value) };
              update('creditPacks', packs);
            }} />
            <button onClick={() => {
              const packs = [...(settings.creditPacks || [])];
              packs.splice(i, 1);
              update('creditPacks', packs);
            }}>Remove</button>
          </div>
        ))}
        <button onClick={() => {
          const packs = [...(settings.creditPacks || [])];
          packs.push({ credits: 0, price: 0 });
          update('creditPacks', packs);
        }}>Add Custom Pack</button>

        <h2>Maintenance Mode</h2>
        <label>
          <input type="checkbox" checked={settings.maintenanceMode || false} onChange={(e) => update('maintenanceMode', e.target.checked)} />
          Enable Maintenance Mode
        </label>
        {settings.maintenanceMode && (
          <div>
            <label>Auto-clear after days: <input type="number" value={settings.maintenanceDays || 7} onChange={(e) => update('maintenanceDays', parseInt(e.target.value))} /></label>
            <label>Message: <textarea value={settings.maintenanceMessage || ''} onChange={(e) => update('maintenanceMessage', e.target.value)} /></label>
          </div>
        )}

        <h2>Registration</h2>
        <label>
          <input type="checkbox" checked={settings.registrationOpen !== false} onChange={(e) => update('registrationOpen', e.target.checked)} />
          Registration Open
        </label>
        {!settings.registrationOpen && (
          <div>
            <label>Closed message: <textarea value={settings.registrationClosedMessage || ''} onChange={(e) => update('registrationClosedMessage', e.target.value)} /></label>
          </div>
        )}

        <button onClick={handleSave}>Save Settings</button>
        {saved && <span>Saved!</span>}
      </div>
    </div>
  );
}