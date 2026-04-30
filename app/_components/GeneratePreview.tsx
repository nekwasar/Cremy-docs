'use client';

import { DocumentSkeleton } from './DocumentSkeleton';
import Link from 'next/link';

interface GeneratePreviewProps {
  documentId?: string;
  isLoading: boolean;
  firstPageContent?: string;
  onDownload: () => void;
}

export function GeneratePreview({
  documentId,
  isLoading,
  firstPageContent,
  onDownload,
}: GeneratePreviewProps) {
  if (isLoading) {
    return (
      <div>
        <DocumentSkeleton sections={[]} progress={50} />
        <p>Generating document...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h3>Preview</h3>
        <div>
          {firstPageContent ? (
            <pre>{firstPageContent}</pre>
          ) : (
            <p>First page preview will appear here</p>
          )}
        </div>
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