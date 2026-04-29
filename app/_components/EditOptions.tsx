'use client';

import { useState } from 'react';

interface EditAction {
  id: string;
  label: string;
  active: boolean;
}

interface EditOptionsProps {
  onRemovePages: (pages: number[]) => void;
  onRotatePages: (pages: number[], degrees: number) => void;
  totalPages: number;
}

export function EditOptions({ onRemovePages, onRotatePages, totalPages }: EditOptionsProps) {
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rotation, setRotation] = useState(90);

  return (
    <div>
      <div>
        <h4>Select Pages</h4>
        <select
          multiple
          value={selectedPages.map(String)}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value));
            setSelectedPages(values);
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i} value={i + 1}>Page {i + 1}</option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={() => onRemovePages(selectedPages)}>Remove Selected</button>
      </div>
      <div>
        <select
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
        >
          <option value={90}>90°</option>
          <option value={180}>180°</option>
          <option value={270}>270°</option>
        </select>
        <button onClick={() => onRotatePages(selectedPages, rotation)}>Rotate</button>
      </div>
    </div>
  );
}