'use client';

import { ReactNode } from 'react';
import { QuickActionButton } from './QuickActionButton';

interface Tool {
  label: string;
  route: string;
}

const tools: Tool[] = [
  { label: 'Generate', route: '/generate' },
  { label: 'Convert', route: '/convert' },
  { label: 'Translate', route: '/translate' },
  { label: 'Voice', route: '/voice' },
  { label: 'Extract', route: '/extract-text-from-pdf' },
  { label: 'Merge', route: '/merge-pdf' },
  { label: 'Split', route: '/split-pdf' },
  { label: 'Compress', route: '/compress-pdf' },
  { label: 'Style', route: '/change-style' },
];

export function QuickActionsGrid(): ReactNode {
  return (
    <div>
      {tools.map((tool) => (
        <QuickActionButton
          key={tool.route}
          label={tool.label}
          route={tool.route}
        />
      ))}
    </div>
  );
}