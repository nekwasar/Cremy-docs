'use client';

interface ClearInputProps {
  hasContent: boolean;
  hasDocument: boolean;
  onClear: () => void;
}

export function ClearInput({ hasContent, hasDocument, onClear }: ClearInputProps) {
  const handleClear = () => {
    if (hasContent && hasDocument) {
      const confirmed = window.confirm(
        'You have an active document. Are you sure you want to clear? Unsaved changes will be lost.'
      );
      if (!confirmed) return;
    }
    onClear();
  };

  return (
    <button type="button" onClick={handleClear} disabled={!hasContent}>
      Clear
    </button>
  );
}