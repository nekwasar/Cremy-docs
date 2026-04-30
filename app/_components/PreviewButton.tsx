'use client';

import { useRouter } from 'next/navigation';

interface PreviewButtonProps {
  documentId: string;
  label?: string;
}

export function PreviewButton({ documentId, label = 'Preview' }: PreviewButtonProps) {
  const router = useRouter();

  const handlePreview = () => {
    router.push(`/preview?doc=${documentId}`);
  };

  return (
    <button onClick={handlePreview} type="button">
      {label}
    </button>
  );
}