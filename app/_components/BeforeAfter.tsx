'use client';

import { useState } from 'react';

interface BeforeAfterProps {
  beforeContent: string;
  afterContent: string;
}

export function BeforeAfter({ beforeContent, afterContent }: BeforeAfterProps) {
  const [view, setView] = useState<'before' | 'after'>('after');

  return (
    <div>
      <div>
        <button onClick={() => setView('before')} disabled={view === 'before'}>
          Before
        </button>
        <button onClick={() => setView('after')} disabled={view === 'after'}>
          After
        </button>
      </div>
      <div>
        {view === 'before' ? (
          <pre>{beforeContent}</pre>
        ) : (
          <pre>{afterContent}</pre>
        )}
      </div>
    </div>
  );
}