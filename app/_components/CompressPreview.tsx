'use client';

import Link from 'next/link';

interface CompressPreviewProps {
  originalSize: number;
  compressedSize: number;
  documentId?: string;
  onDownload: () => void;
}

export function CompressPreview({
  originalSize,
  compressedSize,
  documentId,
  onDownload,
}: CompressPreviewProps) {
  const formatSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const reduction = originalSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return (
    <div>
      <div>
        <div>
          <span>PDF</span>
          <p>Original</p>
          <p>{formatSize(originalSize)}</p>
        </div>
        <span>→</span>
        <div>
          <span>PDF</span>
          <p>Compressed</p>
          <p>{formatSize(compressedSize)}</p>
          {reduction > 0 && <p>Saved {reduction}%</p>}
        </div>
      </div>

      <div>
        <p>{formatSize(originalSize)} → {formatSize(compressedSize)}</p>
      </div>

      <div>
        {documentId && (
          <Link href={`/preview?doc=${documentId}`}>Preview</Link>
        )}
        <button onClick={onDownload}>Download</button>
      </div>
    </div>
  );
}