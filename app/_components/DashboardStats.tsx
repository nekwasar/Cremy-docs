'use client';

interface DashboardStatsProps {
  totalDocuments: number;
  documentsThisMonth: number;
  creditsUsed: number;
  activeTemplates: number;
}

export function DashboardStats({
  totalDocuments,
  documentsThisMonth,
  creditsUsed,
  activeTemplates,
}: DashboardStatsProps) {
  return (
    <div>
      <div>
        <h3>Total Documents</h3>
        <p>{totalDocuments}</p>
      </div>
      <div>
        <h3>This Month</h3>
        <p>{documentsThisMonth}</p>
      </div>
      <div>
        <h3>Credits Used</h3>
        <p>{creditsUsed}</p>
      </div>
      <div>
        <h3>Active Templates</h3>
        <p>{activeTemplates}</p>
      </div>
    </div>
  );
}