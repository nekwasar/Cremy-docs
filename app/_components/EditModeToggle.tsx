'use client';

interface EditModeToggleProps {
  isFullEdit: boolean;
  onToggle: () => void;
}

export function EditModeToggle({ isFullEdit, onToggle }: EditModeToggleProps) {
  return (
    <button onClick={onToggle} type="button">
      {isFullEdit ? 'View Mode' : 'Make Content Editable'}
    </button>
  );
}