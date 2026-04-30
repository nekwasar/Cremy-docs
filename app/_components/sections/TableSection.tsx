'use client';

interface TableSectionProps {
  content: { headers: string[]; rows: string[][] };
  editable?: boolean;
  onChange?: (headers: string[], rows: string[][]) => void;
  elementId?: string;
  isNew?: boolean;
}

export function TableSection({
  content,
  editable = false,
  onChange,
  elementId,
  isNew = false,
}: TableSectionProps) {
  const attrs: Record<string, any> = {
    'data-element-id': elementId || '',
  };
  if (isNew) attrs['data-new'] = 'true';

  if (editable && onChange) {
    const textValue =
      [content.headers.join(','), ...content.rows.map((r) => r.join(','))].join('\n');

    return (
      <textarea
        value={textValue}
        onChange={(e) => {
          const lines = e.target.value.split('\n').filter(Boolean);
          if (lines.length > 0) {
            const newHeaders = lines[0].split(',');
            const newRows = lines.slice(1).map((l) => l.split(','));
            onChange(newHeaders, newRows);
          }
        }}
        {...attrs}
      />
    );
  }

  return (
    <table {...attrs}>
      <thead>
        <tr>
          {content.headers.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}