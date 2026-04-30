'use client';

import Link from 'next/link';

interface VoicePreviewProps {
  firstPageContent?: string;
  documentId?: string;
  onDownload: () => void;
}

export function VoicePreview({
  firstPageContent,
  documentId,
  onDownload,
}: VoicePreviewProps) {
  return (
    <div>
      <div>
        <h3>Voice-to-Document Preview</h3>
        <p>First page preview:</p>
        <div>
          {firstPageContent ? (
            <pre>{firstPageContent}</pre>
          ) : (
            <p>Transcribed content will appear here</p>
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