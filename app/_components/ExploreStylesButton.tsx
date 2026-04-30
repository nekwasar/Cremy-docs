'use client';

interface ExploreStylesButtonProps {
  onClick: () => void;
}

export function ExploreStylesButton({ onClick }: ExploreStylesButtonProps) {
  return (
    <button onClick={onClick} type="button">
      Explore Styles
    </button>
  );
}