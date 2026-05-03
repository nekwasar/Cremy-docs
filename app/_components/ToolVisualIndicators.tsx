'use client';

interface ToolVisualIndicatorsProps {
  activeTool: string | null;
  toolStatus?: string;
}

const TOOL_CONFIG: Record<string, { label: string; indicator: string }> = {
  generate: { label: 'Generate', indicator: '📄' },
  edit: { label: 'Edit', indicator: '✏️' },
  convert: { label: 'Convert', indicator: '🔄' },
  translate: { label: 'Translate', indicator: '🌐' },
  voice: { label: 'Voice', indicator: '🎤' },
  extract: { label: 'Extract', indicator: '📝' },
  merge: { label: 'Merge', indicator: '🔗' },
  split: { label: 'Split', indicator: '✂️' },
  compress: { label: 'Compress', indicator: '📦' },
  'change-style': { label: 'Change Style', indicator: '🎨' },
};

export function ToolVisualIndicators({ activeTool, toolStatus }: ToolVisualIndicatorsProps) {
  if (!activeTool) {
    return (
      <div>
        <p>Select a tool to get started</p>
      </div>
    );
  }

  const config = TOOL_CONFIG[activeTool];

  return (
    <div>
      <span>{config?.indicator || '🔧'}</span>
      <span>{config?.label || activeTool}</span>
      {toolStatus && (
        <span>{toolStatus === 'complete' ? '✓' : ''}</span>
      )}
    </div>
  );
}