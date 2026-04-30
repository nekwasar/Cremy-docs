'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../_components/AdminSidebar';

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
    <div>
      <AdminSidebar />
      <div>
        <h1>Pricing Configuration</h1>

        <h2>Credit Costs Per Action</h2>
        <div>
          <label>Generation: 1 credit per <input type="number" value={config.generation?.perWords || 100} onChange={(e) => updateNested('generation.perWords', parseInt(e.target.value))} /> words</label>
        </div>
        <div>
          <label>Editing: 1 credit per <input type="number" value={config.editing?.perEdits || 10} onChange={(e) => updateNested('editing.perEdits', parseInt(e.target.value))} /> edits</label>
        </div>
        <div>
          <label>Translation: 1 credit per <input type="number" value={config.translation?.perWords || 50} onChange={(e) => updateNested('translation.perWords', parseInt(e.target.value))} /> words</label>
        </div>
        <div>
          <label>Summarize: 1 credit per <input type="number" value={config.summarize?.perWords || 100} onChange={(e) => updateNested('summarize.perWords', parseInt(e.target.value))} /> words</label>
        </div>

        <h2>Credit Bundles</h2>
        {config.bundles?.map((bundle, i) => (
          <div key={i}>
            <input type="number" value={bundle.credits} onChange={(e) => {
              const bundles = [...(config.bundles || [])];
              bundles[i] = { ...bundles[i], credits: parseInt(e.target.value) };
              setConfig({ ...config, bundles });
            }} /> credits: $
            <input type="number" value={bundle.price} onChange={(e) => {
              const bundles = [...(config.bundles || [])];
              bundles[i] = { ...bundles[i], price: parseFloat(e.target.value) };
              setConfig({ ...config, bundles });
            }} />
          </div>
        ))}

        <h2>Pro Subscription</h2>
        <div>
          <label>Monthly: $<input type="number" value={config.proMonthly || 9} onChange={(e) => setConfig({ ...config, proMonthly: parseFloat(e.target.value) })} /></label>
        </div>
        <div>
          <label>Yearly: $<input type="number" value={config.proYearly || 86} onChange={(e) => setConfig({ ...config, proYearly: parseFloat(e.target.value) })} /></label>
        </div>
        <div>
          <label>Credits/month: <input type="number" value={config.proCredits || 200} onChange={(e) => setConfig({ ...config, proCredits: parseInt(e.target.value) })} /></label>
        </div>

        <button onClick={handleSave}>Save Pricing</button>
        {saved && <span>Saved!</span>}
      </div>
    </div>
  );
}