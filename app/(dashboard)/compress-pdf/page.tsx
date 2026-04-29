'use client';

import { useState } from 'react';

export default function CompressPdfPage() {
  const [level, setLevel] = useState('medium');
  const [isCompressing, setIsCompressing] = useState(false);

  return (
    <div>
      <h1>Compress PDF</h1>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button disabled={isCompressing}>
        {isCompressing ? 'Compressing...' : 'Compress'}
      </button>
    </div>
  );
}