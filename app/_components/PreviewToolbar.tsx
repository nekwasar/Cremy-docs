'use client';

import Link from 'next/link';
import { UndoButton } from './UndoButton';
import { EditModeToggle } from './EditModeToggle';

interface PreviewToolbarProps {
  isFullEdit: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onToggleEdit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: (format: string) => void;
  onRegenerate: () => void;
  onBack?: () => void;
}

export function PreviewToolbar({
  isFullEdit,
  onToggleEdit,
  onDownload,
  onRegenerate,
  onBack,
}: PreviewToolbarProps) {
  return (
    <div>
      <div>
        {onBack ? (
          <button onClick={onBack} type="button">← Back</button>
        ) : (
          <Link href="/generate">← Back</Link>
        )}
      </div>

      <div>
        <EditModeToggle isFullEdit={isFullEdit} onToggle={onToggleEdit} />
        <UndoButton />
        <button type="button" onClick={onRegenerate}>Regenerate</button>

        <select
          onChange={(e) => {
            if (e.target.value) {
              onDownload(e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>Download</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="txt">TXT</option>
          <option value="html">HTML</option>
        </select>
      </div>
    </div>
  );
}