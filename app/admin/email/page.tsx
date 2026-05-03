'use client';

import { AdminSidebar } from '../../_components/AdminSidebar';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function AdminEmailPage() {
  return (
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Email System</h1>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Campaigns</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <h3 style={{fontSize:'var(--text-base)',fontWeight:'var(--weight-medium)',marginBottom:'var(--space-4)'}}>Create Campaign</h3>
          <div className={i.group}>
            <label className={i.label}>Campaign Name</label>
            <input className={`${i.input} ${i.soft}`} type="text" />
          </div>
          <div className={i.group}>
            <label className={i.label}>Type</label>
            <select className={`${i.input} ${i.soft}`}>
              <option>Single Send</option>
              <option>Scheduled</option>
              <option>Automated</option>
              <option>Recurring</option>
              <option>A/B Test</option>
            </select>
          </div>
          <div className={i.group}>
            <label className={i.label}>Subject Line</label>
            <input className={`${i.input} ${i.soft}`} type="text" />
          </div>
          <div className={i.group}>
            <label className={i.label}>Send Test Email to</label>
            <input className={`${i.input} ${i.soft}`} type="email" placeholder="test@email.com" />
          </div>
          <button className={`${b.btn} ${b.raw}`}>Send Test</button>
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Audience Segments</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
            <li style={{fontSize:'var(--text-sm)'}}>All Registered Users</li>
            <li style={{fontSize:'var(--text-sm)'}}>Free Users Only</li>
            <li style={{fontSize:'var(--text-sm)'}}>Pro Users Only</li>
            <li style={{display:'flex',alignItems:'center',gap:'var(--space-2)',fontSize:'var(--text-sm)'}}>
              Inactive Users <input className={`${i.input} ${i.minimal}`} type="number" defaultValue={30} style={{width:64}} /> days
            </li>
            <li style={{fontSize:'var(--text-sm)'}}>Never Purchased Users</li>
            <li style={{fontSize:'var(--text-sm)'}}>Users by Country</li>
          </ul>
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Automation Workflows</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)',display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
          {['Welcome Series (new user)', 'Win-Back (inactive 30+ days)', 'Upsell (free to Pro)', 'Feature Announcement', 'Credit Expiry Warning'].map((label) => (
            <label key={label} style={{display:'flex',alignItems:'center',gap:'var(--space-2)',cursor:'pointer',fontSize:'var(--text-sm)'}}>
              <input type="checkbox" />
              {label}
            </label>
          ))}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Email Analytics</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',gap:'var(--space-4)',marginBottom:'var(--space-6)'}}>
          {['Open Rate: --', 'Click Rate: --', 'Unsubscribe Rate: --', 'Bounce Rate: --'].map((label) => (
            <div key={label} className={`${c.card} ${c.soft}`}>
              <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-secondary)'}}>{label}</p>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Brevo Integration</h2>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <div className={i.group}>
            <label className={i.label}>API Key</label>
            <input className={`${i.input} ${i.soft}`} type="password" placeholder="Brevo API key" />
          </div>
          <button className={`${b.btn} ${b.soft}`}>Save Configuration</button>
        </div>
      </div>
    </div>
  );
}
