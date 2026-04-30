'use client';

interface BeforeAfterToggleProps {
  view: 'before' | 'after';
  onToggle: (view: 'before' | 'after') => void;
}

export function BeforeAfterToggle({ view, onToggle }: BeforeAfterToggleProps) {
  return (
    <div>
      <button onClick={() => onToggle('before')} disabled={view === 'before'} type="button">
        Before
      </button>
      <button onClick={() => onToggle('after')} disabled={view === 'after'} type="button">
        After
      </button>
    </div>
  );
}