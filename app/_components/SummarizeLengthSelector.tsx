'use client';

interface SummarizeLengthSelectorProps {
  value: string;
  onChange: (length: string) => void;
}

const OPTIONS = [
  { value: 'brief', label: 'Brief', description: 'A few sentences' },
  { value: 'medium', label: 'Medium', description: 'A paragraph summary' },
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive summary' },
  { value: 'bullets', label: 'Bullet Points', description: 'Key points as bullets' },
];

export function SummarizeLengthSelector({ value, onChange }: SummarizeLengthSelectorProps) {
  return (
    <div>
      <label>Summary Length</label>
      <div>
        {OPTIONS.map((opt) => (
          <label key={opt.value}>
            <input
              type="radio"
              name="summarize-length"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
            <span>{opt.description}</span>
          </label>
        ))}
      </div>
    </div>
  );
}