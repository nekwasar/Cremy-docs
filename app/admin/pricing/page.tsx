'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../_components/AdminSidebar';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function AdminPricingPage() {
  interface PricingConfig {
    generation?: { perWords: number; cost: number };
    editing?: { perEdits: number; cost: number };
    translation?: { perWords: number; cost: number };
    summarize?: { perWords: number; cost: number };
    formatCosts?: Record<string, number>;
    bundles?: Array<{ credits: number; price: number }>;
    proMonthly?: number;
    proYearly?: number;
    proCredits?: number;
  }

  const [config, setConfig] = useState<PricingConfig>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setConfig(data.data);
      });
  }, []);

  const handleSave = async () => {
    await fetch('/api/admin/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateNested = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = { ...config };
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  return (
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Pricing Configuration</h1>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Credit Costs Per Action</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <div className={i.group}>
            <label className={i.label}>Generation: 1 credit per</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={config.generation?.perWords || 100} onChange={(e) => updateNested('generation.perWords', parseInt(e.target.value))} />
            <span className={i.helper}>words</span>
          </div>
          <div className={i.group}>
            <label className={i.label}>Editing: 1 credit per</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={config.editing?.perEdits || 10} onChange={(e) => updateNested('editing.perEdits', parseInt(e.target.value))} />
            <span className={i.helper}>edits</span>
          </div>
          <div className={i.group}>
            <label className={i.label}>Translation: 1 credit per</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={config.translation?.perWords || 50} onChange={(e) => updateNested('translation.perWords', parseInt(e.target.value))} />
            <span className={i.helper}>words</span>
          </div>
          <div className={i.group}>
            <label className={i.label}>Summarize: 1 credit per</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={config.summarize?.perWords || 100} onChange={(e) => updateNested('summarize.perWords', parseInt(e.target.value))} />
            <span className={i.helper}>words</span>
          </div>
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Credit Bundles</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          {config.bundles?.map((bundle, idx) => (
            <div key={idx} style={{display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'var(--space-3)'}}>
              <input className={`${i.input} ${i.minimal}`} type="number" value={bundle.credits} style={{width:100}} onChange={(e2) => {
                const bundles = [...(config.bundles || [])];
                bundles[idx] = { ...bundles[idx], credits: parseInt(e2.target.value) };
                setConfig({ ...config, bundles });
              }} />
              <span style={{fontSize:'var(--text-sm)'}}>credits: $</span>
              <input className={`${i.input} ${i.minimal}`} type="number" value={bundle.price} style={{width:100}} onChange={(e2) => {
                const bundles = [...(config.bundles || [])];
                bundles[idx] = { ...bundles[idx], price: parseFloat(e2.target.value) };
                setConfig({ ...config, bundles });
              }} />
            </div>
          ))}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Pro Subscription</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <div className={i.group}>
            <label className={i.label}>Monthly</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={config.proMonthly || 9} onChange={(e) => setConfig({ ...config, proMonthly: parseFloat(e.target.value) })} />
            <span className={i.helper}>$ / month</span>
          </div>
          <div className={i.group}>
            <label className={i.label}>Yearly</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={config.proYearly || 86} onChange={(e) => setConfig({ ...config, proYearly: parseFloat(e.target.value) })} />
            <span className={i.helper}>$ / year</span>
          </div>
          <div className={i.group}>
            <label className={i.label}>Credits/month</label>
            <input className={`${i.input} ${i.soft}`} type="number" value={config.proCredits || 200} onChange={(e) => setConfig({ ...config, proCredits: parseInt(e.target.value) })} />
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)'}}>
          <button className={`${b.btn} ${b.soft}`} onClick={handleSave}>Save Pricing</button>
          {saved && <span style={{fontSize:'var(--text-sm)',color:'var(--color-success, var(--color-primary))'}}>Saved!</span>}
        </div>
      </div>
    </div>
  );
}
