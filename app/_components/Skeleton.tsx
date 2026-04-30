'use client';

interface SkeletonProps {
  type?: 'text' | 'card' | 'image';
  lines?: number;
  isLoading?: boolean;
}

export function Skeleton({ type = 'text', lines = 3, isLoading = true }: SkeletonProps) {
  if (!isLoading) return null;

  if (type === 'card') {
    return (
      <div>
        <div style={{ height: '120px', background: '#eee' }} />
        <div style={{ height: '16px', background: '#f0f0f0', marginTop: '8px', width: '60%' }} />
        <div style={{ height: '12px', background: '#f5f5f5', marginTop: '4px', width: '80%' }} />
      </div>
    );
  }

  if (type === 'image') {
    return <div style={{ height: '200px', background: '#eee' }} />;
  }

  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '14px',
            background: '#f0f0f0',
            marginTop: '8px',
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}