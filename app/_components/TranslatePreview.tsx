'use client';

import { useState } from 'react';
import { BeforeAfterToggle } from './BeforeAfterToggle';
import Link from 'next/link';

interface TranslatePreviewProps {
  beforeContent?: string;
  afterContent?: string;
  sourceLang?: string;
  targetLang?: string;
  documentId?: string;
  onDownload: () => void;
}

export function TranslatePreview({
  beforeContent,
  afterContent,
  sourceLang,
  targetLang,
  documentId,
  onDownload,
}: TranslatePreviewProps) {
  const [view, setView] = useState<'before' | 'after'>('after');

  return (
    <div>
      <BeforeAfterToggle view={view} onToggle={setView} />

      <div>
        {view === 'before' ? (
          <div>
            <p>{sourceLang || 'Original'} (first page preview)</p>
            <pre>{beforeContent || 'Original content'}</pre>
          </div>
        ) : (
          <div>
            <p>{targetLang || 'Translated'} (first page preview)</p>
            <pre>{afterContent || 'Translated content'}</pre>
          </div>
        )}
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