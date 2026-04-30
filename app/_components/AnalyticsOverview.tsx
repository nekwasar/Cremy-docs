'use client';

interface AnalyticsOverviewProps {
  totalUsers: number;
  totalDocuments: number;
  totalRevenue: number;
  activeUsers: number;
  successRate: number;
  errorRate: number;
}

export function AnalyticsOverview({
  totalUsers,
  totalDocuments,
  totalRevenue,
  activeUsers,
  successRate,
  errorRate,
}: AnalyticsOverviewProps) {
  return (
    <div>
      <div>
        <h3>Total Users</h3>
        <p>{totalUsers}</p>
      </div>
      <div>
        <h3>Documents</h3>
        <p>{totalDocuments}</p>
      </div>
      <div>
        <h3>Revenue</h3>
        <p>${totalRevenue}</p>
      </div>
      <div>
        <h3>Active Users</h3>
        <p>{activeUsers}</p>
      </div>
      <div>
        <h3>Success Rate</h3>
        <p>{successRate}%</p>
      </div>
      <div>
        <h3>Error Rate</h3>
        <p>{errorRate}%</p>
      </div>
    </div>
  );
}