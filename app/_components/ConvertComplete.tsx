'use client';

interface ConvertCompleteProps {
  onPreview: () => void;
  onDownload: () => void;
}

export function ConvertComplete({ onPreview, onDownload }: ConvertCompleteProps) {
  return (
    <div>
      <p>Conversion complete!</p>
      <div>
        <button onClick={onPreview} type="button">Preview</button>
        <button onClick={onDownload} type="button">Download</button>
      </div>
    </div>
  );
}