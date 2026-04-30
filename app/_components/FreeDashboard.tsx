'use client';

import Link from 'next/link';

interface FreeDashboardProps {
  credits: number;
  activityLog: Array<{ action: string; timestamp: string; details: string }>;
}

export function FreeDashboard({ credits, activityLog }: FreeDashboardProps) {
  return (
    <div>
      <div>
        <h2>Your Credits</h2>
        <p>{credits} credits available</p>
      </div>

      <div>
        <h2>Activity History</h2>
        {activityLog.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul>
            {activityLog.slice(0, 20).map((entry, i) => (
              <li key={i}>
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                <span>{entry.action}</span>
                {entry.details && <span>{entry.details}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2>Upgrade to Pro</h2>
        <p>Get unlimited storage, 200 credits/month, version history, and more.</p>
        <Link href="/pro">Upgrade Now</Link>
      </div>
    </div>
  );
}