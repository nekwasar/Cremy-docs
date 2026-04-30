'use client';

import { useState } from 'react';

interface MailcraftPreviewProps {
  content: string;
}

export function MailcraftPreview({ content }: MailcraftPreviewProps) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  const renderedContent = content
    .replace(/\{name\}/g, 'John Doe')
    .replace(/\{email\}/g, 'john@example.com')
    .replace(/\{company\}/g, 'Acme Corp')
    .replace(/\{date\}/g, new Date().toLocaleDateString())
    .replace(/\{unsubscribe_link\}/g, '#unsubscribe');

  return (
    <div>
      <h2>Preview</h2>
      <div>
        <button onClick={() => setView('desktop')} disabled={view === 'desktop'}>
          Desktop
        </button>
        <button onClick={() => setView('mobile')} disabled={view === 'mobile'}>
          Mobile
        </button>
      </div>
      <div style={{ maxWidth: view === 'mobile' ? '375px' : '100%', border: '1px solid #ccc', padding: '16px' }}>
        <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
      </div>
    </div>
  );
}