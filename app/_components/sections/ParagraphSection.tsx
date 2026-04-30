'use client';

interface ParagraphSectionProps {
  content: { text: string };
  editable?: boolean;
  onChange?: (text: string) => void;
  elementId?: string;
  isNew?: boolean;
}

export function ParagraphSection({
  content,
  editable = false,
  onChange,
  elementId,
  isNew = false,
}: ParagraphSectionProps) {
  const attrs: Record<string, any> = {
    'data-element-id': elementId || '',
  };
  if (isNew) attrs['data-new'] = 'true';

  if (editable && onChange) {
    return (
      <textarea
        value={content.text}
        onChange={(e) => onChange(e.target.value)}
        {...attrs}
      />
    );
  }

  const paragraphs = content.text.split('\n').filter(Boolean);
  return (
    <div {...attrs}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}