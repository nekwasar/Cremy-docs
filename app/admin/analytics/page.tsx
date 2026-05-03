'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../_components/AdminSidebar';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import t from '@/styles/components/Table.module.css';

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [overview, setOverview] = useState<any>({});
  const [funnel, setFunnel] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetch(`/api/analytics?range=${dateRange}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOverview(data.data?.overview || {});
          setFunnel(data.data?.funnel || {});
          setErrors(data.data?.errors || {});
        }
      });
  }, [dateRange]);

  const rangeTabs = ['1d','7d','30d','90d'] as const;
  const rangeLabels: Record<string, string> = { '1d':'Today', '7d':'7 Days', '30d':'30 Days', '90d':'90 Days' };

  return (
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Analytics Dashboard</h1>

        <div style={{display:'flex',gap:'var(--space-2)',marginBottom:'var(--space-6)',flexWrap:'wrap'}}>
          {rangeTabs.map((r) => (
            <button
              key={r}
              className={`${b.btn} ${dateRange === r ? b.soft : b.raw}`}
              onClick={() => setDateRange(r)}
            >
              {rangeLabels[r]}
            </button>
          ))}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Overview</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',gap:'var(--space-4)',marginBottom:'var(--space-8)'}}>
          {[
            { label: 'Total Users', value: overview.totalUsers || 0 },
            { label: 'New Users (Period)', value: overview.newUsers || 0 },
            { label: 'Active Users', value: overview.activeUsers || 0 },
            { label: 'Total Revenue', value: `$${overview.totalRevenue || 0}` },
            { label: 'Documents Generated', value: overview.totalDocuments || 0 },
            { label: 'Conversions', value: overview.totalConversions || 0 },
            { label: 'Success Rate', value: `${overview.successRate || 0}%` },
            { label: 'Error Rate', value: `${overview.errorRate || 0}%` },
          ].map((s) => (
            <div key={s.label} className={`${c.card} ${c.soft}`}>
              <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>{s.label}</h3>
              <p style={{fontSize:'var(--text-xl)',fontWeight:'var(--weight-bold)'}}>{s.value}</p>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Tool Usage</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <table className={`${t.table} ${t.soft}`}>
            <thead>
              <tr><th>Tool</th><th>Uses</th></tr>
            </thead>
            <tbody>
              {(overview.toolUsage || []).map((t2: any, i: number) => (
                <tr key={i}><td>{t2._id}</td><td>{t2.count}</td></tr>
              ))}
              {(!overview.toolUsage || overview.toolUsage.length === 0) && (
                <tr><td colSpan={2} className={t.empty}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Top Formats</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <table className={`${t.table} ${t.soft}`}>
            <thead>
              <tr><th>Format</th><th>Uses</th></tr>
            </thead>
            <tbody>
              {(overview.formatUsage || []).map((f: any, i: number) => (
                <tr key={i}><td>{f._id}</td><td>{f.count}</td></tr>
              ))}
              {(!overview.formatUsage || overview.formatUsage.length === 0) && (
                <tr><td colSpan={2} className={t.empty}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Conversion Funnel</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',gap:'var(--space-4)',marginBottom:'var(--space-8)'}}>
          {[
            { label: 'Landing Page Views', value: funnel.landingViews || 0 },
            { label: 'Signups', value: funnel.signups || 0 },
            { label: 'First Generation', value: funnel.firstGen || 0 },
            { label: 'First Conversion', value: funnel.firstConvert || 0 },
            { label: 'Free to Pro', value: funnel.freeToPro || 0 },
          ].map((f) => (
            <div key={f.label} className={`${c.card} ${c.soft}`}>
              <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>{f.label}</h3>
              <p style={{fontSize:'var(--text-xl)',fontWeight:'var(--weight-bold)'}}>{f.value}</p>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Cohort Analysis</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',gap:'var(--space-4)',marginBottom:'var(--space-8)'}}>
          {[
            { label: 'Day 1 Retention', value: `${(overview.retention || {}).day1 || 0}%` },
            { label: 'Day 7 Retention', value: `${(overview.retention || {}).day7 || 0}%` },
            { label: 'Day 30 Retention', value: `${(overview.retention || {}).day30 || 0}%` },
            { label: 'Churn Rate', value: `${(overview.retention || {}).churn || 0}%` },
          ].map((r2) => (
            <div key={r2.label} className={`${c.card} ${c.soft}`}>
              <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>{r2.label}</h3>
              <p style={{fontSize:'var(--text-xl)',fontWeight:'var(--weight-bold)'}}>{r2.value}</p>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Errors</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <p style={{fontSize:'var(--text-base)',marginBottom:'var(--space-4)'}}>Total Errors: <strong>{errors.total || 0}</strong></p>
          <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>By Type</h3>
          <table className={`${t.table} ${t.soft}`}>
            <thead>
              <tr><th>Type</th><th>Count</th></tr>
            </thead>
            <tbody>
              {(errors.byType || []).map((e: any, i: number) => (
                <tr key={i}><td>{e._id}</td><td>{e.count}</td></tr>
              ))}
              {(!errors.byType || errors.byType.length === 0) && (
                <tr><td colSpan={2} className={t.empty}>No errors</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Realtime</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',gap:'var(--space-4)',marginBottom:'var(--space-8)'}}>
          <div className={`${c.card} ${c.soft}`}>
            <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>Active Users Now</h3>
            <p style={{fontSize:'var(--text-xl)',fontWeight:'var(--weight-bold)'}}>{overview.realtime || 0}</p>
          </div>
          <div className={`${c.card} ${c.soft}`}>
            <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>Current Sessions</h3>
            <p style={{fontSize:'var(--text-xl)',fontWeight:'var(--weight-bold)'}}>{overview.currentSessions || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
