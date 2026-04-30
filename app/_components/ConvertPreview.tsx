'use client';

import { useState } from 'react';
import { BeforeAfterToggle } from './BeforeAfterToggle';
import Link from 'next/link';

interface ConvertPreviewProps {
  beforeContent?: string;
  afterContent?: string;
  documentId?: string;
  onDownload: () => void;
}

export function ConvertPreview({
  beforeContent,
  afterContent,
  documentId,
  onDownload,
}: ConvertPreviewProps) {
  const [view, setView] = useState<'before' | 'after'>('after');

  return (
    <div>
      <BeforeAfterToggle view={view} onToggle={setView} />

      <div>
        {view === 'before' ? (
          <div>
            <p>Original (first page preview)</p>
            <pre>{beforeContent || 'Original file content'}</pre>
          </div>
        ) : (
          <div>
            <p>Converted (first page preview)</p>
            <pre>{afterContent || 'Converted file content'}</pre>
          </div>
        )}
      </div>

      <p>100% quality as promised - your file content is unchanged.</p>

      <div>
        {documentId && (
          <Link href={`/preview?doc=${documentId}`}>Preview</Link>
        )}
        <button onClick={onDownload}>Download</button>
      </div>
    </div>
  );
}