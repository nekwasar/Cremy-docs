'use client';

interface CompressionLevelProps {
  value: string;
  onChange: (level: string) => void;
}

const LEVELS = [
  { value: 'low', label: 'Low', description: 'Minimal compression, highest quality' },
  { value: 'medium', label: 'Medium', description: 'Balanced quality and size reduction' },
  { value: 'high', label: 'High', description: 'Maximum compression, smaller file size' },
];

export function CompressionLevel({ value, onChange }: CompressionLevelProps) {
  return (
    <div>
      <h3>Compression Level</h3>
      <div>
        {LEVELS.map((level) => (
          <label key={level.value}>
            <input
              type="radio"
              name="compression"
              value={level.value}
              checked={value === level.value}
              onChange={() => onChange(level.value)}
            />
            <span>{level.label}</span>
            <span>{level.description}</span>
          </label>
        ))}
      </div>
    </div>
  );
}