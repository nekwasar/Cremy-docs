'use client';

interface AdminStatsProps {
  totalUsers: number;
  totalDocuments: number;
  totalCreditsSold: number;
  activeSubscriptions: number;
}

export function AdminStats({
  totalUsers,
  totalDocuments,
  totalCreditsSold,
  activeSubscriptions,
}: AdminStatsProps) {
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
        <h3>Credits Sold</h3>
        <p>{totalCreditsSold}</p>
      </div>
      <div>
        <h3>Active Subs</h3>
        <p>{activeSubscriptions}</p>
      </div>
    </div>
  );
}