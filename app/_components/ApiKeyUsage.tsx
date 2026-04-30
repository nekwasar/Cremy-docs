'use client';

interface ApiKeyUsageProps {
  requestsToday: number;
  requestsMonth: number;
  lastUsed: string;
  status: string;
}

export function ApiKeyUsage({ requestsToday, requestsMonth, lastUsed, status }: ApiKeyUsageProps) {
  return (
    <div>
      <div>
        <p>Requests Today: {requestsToday}</p>
      </div>
      <div>
        <p>Requests This Month: {requestsMonth}</p>
      </div>
      <div>
        <p>Last Used: {lastUsed || 'Never'}</p>
      </div>
      <div>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}