'use client';

import Link from 'next/link';

interface SummarizePreviewProps {
  originalText: string;
  summary: string;
  isLoading: boolean;
  documentId?: string;
  onDownload: () => void;
  onExpand: () => void;
}

export function SummarizePreview({
  originalText,
  summary,
  isLoading,
  documentId,
  onDownload,
  onExpand,
}: SummarizePreviewProps) {
  const originalWords = originalText.split(/\s+/).filter(Boolean).length;
  const summaryWords = summary.split(/\s+/).filter(Boolean).length;

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <div>
        <h3>Summary</h3>
        <div>{summary || 'No summary yet'}</div>
      </div>

      <div>
        <p>Original: {originalWords} words</p>
        <p>Summary: {summaryWords} words</p>
        {originalWords > 0 && (
          <p>Reduced by {Math.round((1 - summaryWords / originalWords) * 100)}%</p>
        )}
      </div>

      <div>
        {documentId && (
          <Link href={`/preview?doc=${documentId}`}>Preview</Link>
        )}
        <button onClick={onDownload}>Download</button>
        <button onClick={onExpand}>Expand to Full Document</button>
      </div>
    </div>
  );
}