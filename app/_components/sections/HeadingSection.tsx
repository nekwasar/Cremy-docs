'use client';

interface HeadingSectionProps {
  content: { text: string; level: number };
  editable?: boolean;
  onChange?: (text: string) => void;
  elementId?: string;
  isNew?: boolean;
}

export function HeadingSection({
  content,
  editable = false,
  onChange,
  elementId,
  isNew = false,
}: HeadingSectionProps) {
  const Tag = `h${Math.min(Math.max(content.level || 1, 1), 3)}` as keyof JSX.IntrinsicElements;
  const attrs: Record<string, any> = {
    'data-element-id': elementId || '',
  };
  if (isNew) attrs['data-new'] = 'true';

  if (editable && onChange) {
    return (
      <input
        type="text"
        value={content.text}
        onChange={(e) => onChange(e.target.value)}
        {...attrs}
      />
    );
  }

  return <Tag {...attrs}>{content.text}</Tag>;
}