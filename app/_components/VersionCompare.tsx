'use client';

interface VersionCompareProps {
  oldContent: string;
  newContent: string;
}

export function VersionCompare({ oldContent, newContent }: VersionCompareProps) {
  return (
    <div>
      <div>
        <h3>Previous Version</h3>
        <pre>{oldContent.slice(0, 500)}{oldContent.length > 500 ? '...' : ''}</pre>
      </div>
      <div>
        <h3>Current Version</h3>
        <pre>{newContent.slice(0, 500)}{newContent.length > 500 ? '...' : ''}</pre>
      </div>
    </div>
  );
}