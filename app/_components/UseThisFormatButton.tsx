'use client';

import { useRouter } from 'next/navigation';

interface UseThisFormatButtonProps {
  formatId: string;
}

export function UseThisFormatButton({ formatId }: UseThisFormatButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/generate?format=${formatId}`);
  };

  return (
    <button onClick={handleClick} type="button">
      Use This Format
    </button>
  );
}