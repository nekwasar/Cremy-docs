'use client';

interface FormatNameProps {
  name: string;
  category?: string;
}

export function FormatName({ name, category }: FormatNameProps) {
  return (
    <div>
      <h1>{name}</h1>
      {category && <span>{category}</span>}
    </div>
  );
}