'use client';

interface ActivityTimelineProps {
  timeline: Array<{ action: string; timestamp: string; details: string }>;
}

export function ActivityTimeline({ timeline }: ActivityTimelineProps) {
  return (
    <div>
      <h3>Activity Timeline</h3>
      {timeline.length === 0 ? (
        <p>No recent activity</p>
      ) : (
        <ul>
          {timeline.map((entry, i) => (
            <li key={i}>
              <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
              <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              <strong>{entry.action}</strong>
              {entry.details && <span>{entry.details}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}