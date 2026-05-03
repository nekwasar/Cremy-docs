'use client';

import { useState } from 'react';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

export default function CompressPdfPage() {
  const [level, setLevel] = useState('medium');
  const [isCompressing, setIsCompressing] = useState(false);

  return (
    <div style={{maxWidth:'var(--container-lg)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1>Compress PDF</h1>

      <div className={c.soft}>
        <div className={i.group}>
          <label className={i.label}>Compression Level</label>
          <select className={i.soft} value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button className={b.soft} disabled={isCompressing}>
          Compress
        </button>
      </div>
    </div>
  );
}
