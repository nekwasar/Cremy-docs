'use client';

import { useDashboardStore } from '@/store/dashboard-store';

export function UpgradePrompt() {
  return (
    <div>
      <h3>Unlock Pro Features</h3>
      <ul>
        <li>Unlimited cloud storage</li>
        <li>Version history for all documents</li>
        <li>Folder organization</li>
        <li>Advanced analytics</li>
        <li>200 credits/month</li>
      </ul>
      <a href="/pro">Upgrade to Pro</a>
    </div>
  );
}