'use client';

interface FormatDescriptionProps {
  description: string;
}

export function FormatDescription({ description }: FormatDescriptionProps) {
  return (
    <div>
      <p>{description}</p>
    </div>
  );
}