'use client';

import { useState } from 'react';

interface SplitClarificationProps {
  totalPages: number;
  onConfirm: (groups: number[][]) => void;
}

export function SplitClarification({ totalPages, onConfirm }: SplitClarificationProps) {
  const [mode, setMode] = useState<'range' | 'custom'>('range');
  const [range1, setRange1] = useState({ from: 1, to: Math.ceil(totalPages / 2) });
  const [range2, setRange2] = useState({ from: Math.ceil(totalPages / 2) + 1, to: totalPages });
  const [customPages, setCustomPages] = useState('');

  const handleConfirm = () => {
    if (mode === 'range') {
      const group1: number[] = [];
      for (let i = range1.from; i <= range1.to; i++) group1.push(i);
      const group2: number[] = [];
      for (let i = range2.from; i <= range2.to; i++) group2.push(i);
      onConfirm([group1, group2]);
    } else {
      const parts = customPages.split(',').map((p) => p.trim());
      const groups: number[][] = [];
      for (const part of parts) {
        const pages = part.split(' ').filter(Boolean).map(Number);
        groups.push(pages.filter((n) => !isNaN(n)));
      }
      onConfirm(groups);
    }
  };

  return (
    <div>
      <p>How should the pages be split?</p>

      <div>
        <button onClick={() => setMode('range')} disabled={mode === 'range'}>Range</button>
        <button onClick={() => setMode('custom')} disabled={mode === 'custom'}>Custom</button>
      </div>

      {mode === 'range' ? (
        <div>
          <p>Page {range1.from} to {range1.to} separate from page {range2.from} to {range2.to}?</p>
          <div>
            <label>Group 1: from <input type="number" min={1} max={totalPages} value={range1.from} onChange={(e) => setRange1({ ...range1, from: parseInt(e.target.value) || 1 })} /> to <input type="number" min={1} max={totalPages} value={range1.to} onChange={(e) => setRange1({ ...range1, to: parseInt(e.target.value) || 1 })} /></label>
          </div>
          <div>
            <label>Group 2: from <input type="number" min={1} max={totalPages} value={range2.from} onChange={(e) => setRange2({ ...range2, from: parseInt(e.target.value) || 1 })} /> to <input type="number" min={1} max={totalPages} value={range2.to} onChange={(e) => setRange2({ ...range2, to: parseInt(e.target.value) || 1 })} /></label>
          </div>
        </div>
      ) : (
        <div>
          <p>Enter pages separated by commas (e.g. "1 3 5, 2 4 6"):</p>
          <input
            type="text"
            value={customPages}
            onChange={(e) => setCustomPages(e.target.value)}
            placeholder="1 3 5, 2 4 6"
          />
        </div>
      )}

      <button onClick={handleConfirm}>Confirm &amp; Split</button>
    </div>
  );
}