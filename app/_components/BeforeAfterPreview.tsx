'use client';

import { ReactNode, useState } from 'react';

interface BeforeAfterPreviewProps {
  beforeContent: ReactNode;
  afterContent: ReactNode;
}

export function BeforeAfterPreview({
  beforeContent,
  afterContent,
}: BeforeAfterPreviewProps): ReactNode {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div>
      <div>
        <button
          className={!showAfter ? 'active' : ''}
          onClick={() => setShowAfter(false)}
        >
          Before
        </button>
        <button
          className={showAfter ? 'active' : ''}
          onClick={() => setShowAfter(true)}
        >
          After
        </button>
      </div>
      <div>
        {showAfter ? afterContent : beforeContent}
      </div>
    </div>
  );
}