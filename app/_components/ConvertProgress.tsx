'use client';

interface ConvertProgressProps {
  progress: number;
  isConverting: boolean;
  step?: string;
}

export function ConvertProgress({ progress, isConverting, step }: ConvertProgressProps) {
  if (!isConverting && progress === 0) return null;

  return (
    <div style={{ marginTop: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <progress value={progress} max={100} style={{ flex: 1 }}>{progress}%</progress>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{progress}%</span>
      </div>
      {step && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{step}</p>}
    </div>
  );
}