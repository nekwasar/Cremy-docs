'use client';

import { ReactNode } from 'react';

const features: string[] = [
  'Create professional documents',
  'Convert any file format',
  'Translate to any language',
  'Voice to document',
  'Extract text from PDF/image',
  'Merge, split, compress PDFs',
  'Change document style',
  'AI-powered editing',
];

export function FeaturesSection(): ReactNode {
  return (
    <div className="features-section">
      <ul className="features-list">
        {features.map((feature) => (
          <li key={feature} className="feature-item">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}