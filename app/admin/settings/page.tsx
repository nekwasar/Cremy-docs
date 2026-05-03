'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../_components/AdminSidebar';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

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
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>System Settings</h1>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Free Credits</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <div className={i.group}>
            <label className={i.label}>Anonymous user credits</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={settings.anonymousCredits || 5} onChange={(e) => update('anonymousCredits', parseInt(e.target.value))} />
          </div>
          <div className={i.group}>
            <label className={i.label}>Registered user credits</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={settings.registeredCredits || 10} onChange={(e) => update('registeredCredits', parseInt(e.target.value))} />
          </div>
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Credit Costs</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          {[
            { key: 'genPerWords', label: 'Generation: 1 credit per X words', def: 100 },
            { key: 'editPerEdits', label: 'AI Editing: 1 credit per X edits', def: 10 },
            { key: 'translatePerWords', label: 'Translation: 1 credit per X words', def: 50 },
            { key: 'ocrPerWords', label: 'OCR: 1 credit per X words', def: 50 },
            { key: 'stylePerWords', label: 'Change Style: 1 credit per X words', def: 100 },
            { key: 'imageCost', label: 'Image Add: credits per image', def: 1 },
          ].map(({ key, label, def }) => (
            <div key={key} style={{display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:'var(--space-3)'}}>
              <div style={{flex:1}}>
                <label className={i.label} style={{marginBottom:0}}>{label}</label>
              </div>
              <input className={`${i.input} ${i.minimal}`} type="number" value={settings[key] ?? def} onChange={(e) => update(key, parseInt(e.target.value) || 0)} style={{width:100}} />
              <label style={{display:'flex',alignItems:'center',gap:'var(--space-1)',cursor:'pointer',fontSize:'var(--text-xs)'}}>
                <input type="checkbox" checked={settings[`${key}_free`] || false} onChange={(e) => update(`${key}_free`, e.target.checked)} />
                FREE
              </label>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Credit Packs</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          {(settings.creditPacks || [{ credits: 100, price: 10 }, { credits: 500, price: 40 }]).map((pack: any, idx: number) => (
            <div key={idx} style={{display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'var(--space-3)'}}>
              <input className={`${i.input} ${i.minimal}`} type="number" value={pack.credits} style={{width:100}} onChange={(e) => {
                const packs = [...(settings.creditPacks || [{ credits: 100, price: 10 }, { credits: 500, price: 40 }])];
                packs[idx] = { ...packs[idx], credits: parseInt(e.target.value) };
                update('creditPacks', packs);
              }} />
              <span style={{fontSize:'var(--text-sm)'}}>credits: $</span>
              <input className={`${i.input} ${i.minimal}`} type="number" value={pack.price} style={{width:100}} onChange={(e) => {
                const packs = [...(settings.creditPacks || [{ credits: 100, price: 10 }, { credits: 500, price: 40 }])];
                packs[idx] = { ...packs[idx], price: parseFloat(e.target.value) };
                update('creditPacks', packs);
              }} />
              <button className={`${b.btn} ${b.minimal}`} onClick={() => {
                const packs = [...(settings.creditPacks || [])];
                packs.splice(idx, 1);
                update('creditPacks', packs);
              }}>Remove</button>
            </div>
          ))}
          <button className={`${b.btn} ${b.minimal}`} style={{marginTop:'var(--space-2)'}} onClick={() => {
            const packs = [...(settings.creditPacks || [])];
            packs.push({ credits: 0, price: 0 });
            update('creditPacks', packs);
          }}>Add Custom Pack</button>
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Maintenance Mode</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <label style={{display:'flex',alignItems:'center',gap:'var(--space-2)',cursor:'pointer',marginBottom:'var(--space-4)',fontSize:'var(--text-sm)'}}>
            <input type="checkbox" checked={settings.maintenanceMode || false} onChange={(e) => update('maintenanceMode', e.target.checked)} />
            Enable Maintenance Mode
          </label>
          {settings.maintenanceMode && (
            <>
              <div className={i.group}>
                <label className={i.label}>Auto-clear after days</label>
                <input className={`${i.input} ${i.soft}`} type="number" value={settings.maintenanceDays || 7} onChange={(e) => update('maintenanceDays', parseInt(e.target.value))} />
              </div>
              <div className={i.group}>
                <label className={i.label}>Message</label>
                <textarea className={`${i.input} ${i.soft} ${i.textarea}`} value={settings.maintenanceMessage || ''} onChange={(e) => update('maintenanceMessage', e.target.value)} />
              </div>
            </>
          )}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Registration</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <label style={{display:'flex',alignItems:'center',gap:'var(--space-2)',cursor:'pointer',marginBottom:'var(--space-4)',fontSize:'var(--text-sm)'}}>
            <input type="checkbox" checked={settings.registrationOpen !== false} onChange={(e) => update('registrationOpen', e.target.checked)} />
            Registration Open
          </label>
          {!settings.registrationOpen && (
            <div className={i.group}>
              <label className={i.label}>Closed message</label>
              <textarea className={`${i.input} ${i.soft} ${i.textarea}`} value={settings.registrationClosedMessage || ''} onChange={(e) => update('registrationClosedMessage', e.target.value)} />
            </div>
          )}
        </div>

        <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)'}}>
          <button className={`${b.btn} ${b.soft}`} onClick={handleSave}>Save Settings</button>
          {saved && <span style={{fontSize:'var(--text-sm)',color:'var(--color-success, var(--color-primary))'}}>Saved!</span>}
        </div>
      </div>
    </div>
  );
}
