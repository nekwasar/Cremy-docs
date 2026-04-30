'use client';

interface StructureOption {
  id: string;
  label: string;
  subtypes?: string[];
}

const STRUCTURES: StructureOption[] = [
  { id: 'auto', label: 'Auto (AI detects)' },
  { id: 'business', label: 'Business', subtypes: ['Invoice', 'Contract', 'Proposal', 'Report', 'Memo'] },
  { id: 'academic', label: 'Academic', subtypes: ['Essay', 'Research Paper', 'Thesis', 'Study Guide'] },
  { id: 'legal', label: 'Legal', subtypes: ['NDA', 'Agreement', 'Affidavit'] },
  { id: 'personal', label: 'Personal', subtypes: ['Resume', 'Cover Letter', 'CV'] },
  { id: 'creative', label: 'Creative', subtypes: ['Story', 'Blog Post', 'Newsletter'] },
];

interface DocStructureSelectorProps {
  value: string;
  onChange: (structure: string) => void;
}

export function DocStructureSelector({ value, onChange }: DocStructureSelectorProps) {
  return (
    <div>
      <label>Doc Structure</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {STRUCTURES.map((structure) => (
          <optgroup key={structure.id} label={structure.label}>
            {structure.subtypes ? (
              structure.subtypes.map((subtype) => (
                <option key={`${structure.id}-${subtype.toLowerCase()}`} value={`${structure.id}-${subtype.toLowerCase()}`}>
                  {subtype}
                </option>
              ))
            ) : (
              <option value={structure.id}>{structure.label}</option>
            )}
          </optgroup>
        ))}
      </select>
    </div>
  );
}