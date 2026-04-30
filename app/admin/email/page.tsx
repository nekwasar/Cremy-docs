'use client';

import { AdminSidebar } from '../../_components/AdminSidebar';

export default function AdminEmailPage() {
  return (
    <div>
      <AdminSidebar />
      <div>
        <h1>Email System</h1>

        <h2>Campaigns</h2>
        <div>
          <h3>Create Campaign</h3>
          <div>
            <label>Campaign Name: <input type="text" /></label>
          </div>
          <div>
            <label>Type:
              <select>
                <option>Single Send</option>
                <option>Scheduled</option>
                <option>Automated</option>
                <option>Recurring</option>
                <option>A/B Test</option>
              </select>
            </label>
          </div>
          <div>
            <label>Subject Line: <input type="text" /></label>
          </div>
          <div>
            <label>Send Test Email to: <input type="email" placeholder="test@email.com" /></label>
          </div>
          <button>Send Test</button>
        </div>

        <h2>Audience Segments</h2>
        <ul>
          <li>All Registered Users</li>
          <li>Free Users Only</li>
          <li>Pro Users Only</li>
          <li>Inactive Users (X days): <input type="number" defaultValue={30} /></li>
          <li>Never Purchased Users</li>
          <li>Users by Country</li>
        </ul>

        <h2>Automation Workflows</h2>
        <div>
          <label><input type="checkbox" /> Welcome Series (new user)</label>
        </div>
        <div>
          <label><input type="checkbox" /> Win-Back (inactive 30+ days)</label>
        </div>
        <div>
          <label><input type="checkbox" /> Upsell (free → Pro)</label>
        </div>
        <div>
          <label><input type="checkbox" /> Feature Announcement</label>
        </div>
        <div>
          <label><input type="checkbox" /> Credit Expiry Warning</label>
        </div>

        <h2>Email Analytics</h2>
        <div>
          <div>
            <p>Open Rate: --</p>
          </div>
          <div>
            <p>Click Rate: --</p>
          </div>
          <div>
            <p>Unsubscribe Rate: --</p>
          </div>
          <div>
            <p>Bounce Rate: --</p>
          </div>
        </div>

        <h2>Brevo Integration</h2>
        <div>
          <label>API Key: <input type="password" placeholder="Brevo API key" /></label>
        </div>
        <button>Save Configuration</button>
      </div>
    </div>
  );
}