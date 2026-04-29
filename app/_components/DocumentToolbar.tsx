'use client';

interface DocumentToolbarProps {
  documentTitle: string;
  onUndo: () => void;
  onRedo: () => void;
  onBack: () => void;
  onDownload: (format: string) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function DocumentToolbar({
  documentTitle,
  onUndo,
  onRedo,
  onBack,
  onDownload,
  canUndo,
  canRedo,
}: DocumentToolbarProps) {
  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2>{documentTitle || 'Untitled Document'}</h2>
      <div>
        <button onClick={onUndo} disabled={!canUndo}>Undo</button>
        <button onClick={onRedo} disabled={!canRedo}>Redo</button>
      </div>
      <div>
        <select onChange={(e) => onDownload(e.target.value)} defaultValue="">
          <option value="" disabled>Download</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="txt">TXT</option>
          <option value="md">Markdown</option>
        </select>
      </div>
    </div>
  );
}