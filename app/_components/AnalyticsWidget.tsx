'use client';

interface AnalyticsWidgetProps {
  documentsThisMonth: number;
  creditsUsedThisMonth: number;
  mostUsedFormats: Array<{ format: string; count: number }>;
}

export function AnalyticsWidget({
  documentsThisMonth,
  creditsUsedThisMonth,
  mostUsedFormats,
}: AnalyticsWidgetProps) {
  return (
    <div>
      <h3>Analytics</h3>

      <div>
        <div>
          <h4>Documents This Month</h4>
          <p>{documentsThisMonth}</p>
        </div>
        <div>
          <h4>Credits Used This Month</h4>
          <p>{creditsUsedThisMonth}</p>
        </div>
      </div>

      <div>
        <h4>Most Used Formats</h4>
        {mostUsedFormats.length === 0 ? (
          <p>No format data available</p>
        ) : (
          <ol>
            {mostUsedFormats.slice(0, 5).map((f, i) => (
              <li key={i}>
                <span>{f.format}</span>
                <span>{f.count} documents</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}