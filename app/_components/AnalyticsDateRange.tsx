'use client';

interface AnalyticsDateRangeProps {
  value: string;
  onChange: (range: string) => void;
}

const PRESETS = [
  { value: '1d', label: 'Today' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
];

export function AnalyticsDateRange({ value, onChange }: AnalyticsDateRangeProps) {
  return (
    <div>
      {PRESETS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onChange(preset.value)}
          disabled={value === preset.value}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}