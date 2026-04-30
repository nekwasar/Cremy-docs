'use client';

interface BulkDocumentActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  onExportAll: () => void;
}

export function BulkDocumentActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onExportAll,
}: BulkDocumentActionsProps) {
  return (
    <div>
      <div>
        <button onClick={onSelectAll}>Select All</button>
        <button onClick={onDeselectAll}>Deselect All</button>
        <span>{selectedCount} of {totalCount} selected</span>
      </div>
      <div>
        <button onClick={onDeleteSelected} disabled={selectedCount === 0}>
          Delete Selected ({selectedCount})
        </button>
        <button onClick={onExportAll}>Export All Documents</button>
      </div>
    </div>
  );
}