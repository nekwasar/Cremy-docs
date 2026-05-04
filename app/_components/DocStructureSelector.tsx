'use client';

import { Select } from './Select';

interface DocStructureSelectorProps {
  value: string;
  onChange: (structure: string) => void;
}

const STRUCTURES = [
  { value: 'auto', label: 'Auto (AI detects)' },
  { value: 'business-invoice', label: 'Business — Invoice' },
  { value: 'business-contract', label: 'Business — Contract' },
  { value: 'business-proposal', label: 'Business — Proposal' },
  { value: 'business-report', label: 'Business — Report' },
  { value: 'business-memo', label: 'Business — Memo' },
  { value: 'academic-essay', label: 'Academic — Essay' },
  { value: 'academic-research-paper', label: 'Academic — Research Paper' },
  { value: 'academic-thesis', label: 'Academic — Thesis' },
  { value: 'academic-study-guide', label: 'Academic — Study Guide' },
  { value: 'legal-nda', label: 'Legal — NDA' },
  { value: 'legal-agreement', label: 'Legal — Agreement' },
  { value: 'legal-affidavit', label: 'Legal — Affidavit' },
  { value: 'personal-resume', label: 'Personal — Resume' },
  { value: 'personal-cover-letter', label: 'Personal — Cover Letter' },
  { value: 'personal-cv', label: 'Personal — CV' },
  { value: 'creative-story', label: 'Creative — Story' },
  { value: 'creative-blog-post', label: 'Creative — Blog Post' },
  { value: 'creative-newsletter', label: 'Creative — Newsletter' },
];

export function DocStructureSelector({ value, onChange }: DocStructureSelectorProps) {
  return <Select options={STRUCTURES} value={value} onChange={onChange} placeholder="Doc Structure" />;
}
