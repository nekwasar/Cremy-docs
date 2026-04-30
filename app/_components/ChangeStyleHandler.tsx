'use client';

import Link from 'next/link';

interface ChangeStyleHandlerProps {
  selectedStyle: string;
  originalContent?: string;
  styledContent?: string;
  documentId?: string;
  isLoading: boolean;
  onDownload: () => void;
}

export function ChangeStyleHandler({
  selectedStyle,
  originalContent,
  styledContent,
  documentId,
  isLoading,
  onDownload,
}: ChangeStyleHandlerProps) {
  if (isLoading) {
    return (
      <div>
        <p>Converting to text and recreating in {selectedStyle} style...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <h4>Original ({selectedStyle} applied)</h4>
          {originalContent ? (
            <pre>{originalContent.slice(0, 500)}{originalContent.length > 500 ? '...' : ''}</pre>
          ) : (
            <p>Original content</p>
          )}
        </div>
        <div>
          <h4>New Style: {selectedStyle}</h4>
          {styledContent ? (
            <pre>{styledContent.slice(0, 500)}{styledContent.length > 500 ? '...' : ''}</pre>
          ) : (
            <p>Styled content will appear here</p>
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