'use client';

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

const STYLES: StyleOption[] = [
  { id: 'professional', name: 'Professional', description: 'Business-ready formal tone' },
  { id: 'casual', name: 'Casual', description: 'Friendly and approachable' },
  { id: 'academic', name: 'Academic', description: 'Scholarly and research-focused' },
  { id: 'creative', name: 'Creative', description: 'Expressive and imaginative' },
  { id: 'legal', name: 'Legal', description: 'Precise and legally sound' },
];

interface StyleSelectorProps {
  selected: string;
  onChange: (styleId: string) => void;
}

export function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  return (
    <div>
      <h3>Choose Style</h3>
      <div>
        {STYLES.map((style) => (
          <label key={style.id}>
            <input
              type="radio"
              name="style"
              value={style.id}
              checked={selected === style.id}
              onChange={() => onChange(style.id)}
            />
            <span>{style.name}</span>
            <span>{style.description}</span>
          </label>
        ))}
      </div>
    </div>
  );
}