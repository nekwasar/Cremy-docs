'use client';

import { useState } from 'react';
import { Select } from './Select';

const ROTATIONS = [
  { value: '90', label: '90°' },
  { value: '180', label: '180°' },
  { value: '270', label: '270°' },
];

export function EditOptions({ onRemovePages, onRotatePages, totalPages }: { onRemovePages: (p: number[]) => void; onRotatePages: (p: number[], d: number) => void; totalPages: number }) {
  const [selectedPages] = useState<number[]>([]);

  return (
    <div>
      <button onClick={() => onRemovePages(selectedPages)}>Remove Selected</button>
      <div style={{display:'flex',gap:'var(--space-3)',marginTop:'var(--space-3)',alignItems:'center'}}>
        <Select options={ROTATIONS} value="90" onChange={(v) => onRotatePages(selectedPages, parseInt(v))} placeholder="Rotation" />
      </div>
    </div>
  );
}
