'use client';

import { useState } from 'react';

interface BulkActionsProps {
  selectedIds: string[];
  onDeleteSelected: () => void;
  onExportAll: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalDocuments: number;
}

export function BulkActions({
  selectedIds,
  onDeleteSelected,
  onExportAll,
  onSelectAll,
  onDeselectAll,
  totalDocuments,
}: BulkActionsProps) {
  return (
    <div>
      <div>
        <button onClick={onSelectAll}>Select All</button>
        <button onClick={onDeselectAll}>Deselect All</button>
        <span>{selectedIds.length} of {totalDocuments} selected</span>
      </div>
      <div>
        <button onClick={onDeleteSelected} disabled={selectedIds.length === 0}>
          Delete Selected ({selectedIds.length})
        </button>
        <button onClick={onExportAll}>Export All Documents</button>
      </div>
    </div>
  );
}