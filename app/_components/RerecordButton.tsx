'use client';

interface RerecordButtonProps {
  onClick: () => void;
}

export function RerecordButton({ onClick }: RerecordButtonProps) {
  return (
    <button onClick={onClick} type="button">
      Record Again
    </button>
  );
}