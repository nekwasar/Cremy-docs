'use client';

import { useState } from 'react';

interface ReasoningViewProps {
  reasoning: string;
}

export function ReasoningView({ reasoning }: ReasoningViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!reasoning) return null;

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} type="button">
        {isOpen ? 'Hide' : 'View'} reasoning
      </button>
      {isOpen && (
        <div>
          <pre>{reasoning}</pre>
        </div>
      )}
    </div>
  );
}
