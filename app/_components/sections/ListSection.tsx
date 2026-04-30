'use client';

interface ListSectionProps {
  content: { items: string[]; ordered: boolean };
  editable?: boolean;
  onChange?: (items: string[]) => void;
  elementId?: string;
  isNew?: boolean;
}

export function ListSection({
  content,
  editable = false,
  onChange,
  elementId,
  isNew = false,
}: ListSectionProps) {
  const attrs: Record<string, any> = {
    'data-element-id': elementId || '',
  };
  if (isNew) attrs['data-new'] = 'true';

  const Tag = content.ordered ? 'ol' : 'ul';

  if (editable && onChange) {
    return (
      <textarea
        value={content.items.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        {...attrs}
      />
    );
  }

  return (
    <Tag {...attrs}>
      {content.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}