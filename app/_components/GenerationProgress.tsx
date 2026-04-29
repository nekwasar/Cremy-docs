'use client';

import { useState, useEffect } from 'react';

type GenerationStep = 'analyzing' | 'generating' | 'formatting' | 'complete';

interface GenerationProgressProps {
  progress: number;
  step: GenerationStep;
  onCancel?: () => void;
}

const STEP_LABELS: Record<GenerationStep, string> = {
  analyzing: 'Analyzing your request...',
  generating: 'Generating document...',
  formatting: 'Formatting output...',
  complete: 'Complete!',
};

export function GenerationProgress({ progress, step, onCancel }: GenerationProgressProps) {
  const [cancelConfirm, setCancelConfirm] = useState(false);

  const handleCancel = () => {
    if (cancelConfirm && onCancel) {
      onCancel();
      setCancelConfirm(false);
    } else {
      setCancelConfirm(true);
      setTimeout(() => setCancelConfirm(false), 3000);
    }
  };

  return (
    <div>
      <div>
        <p>{STEP_LABELS[step]}</p>
        <div>
          <div>
            <div style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}%</span>
        </div>
      </div>

      <div>
        <div>
          <span>Analyzing</span>
          <span>Generating</span>
          <span>Formatting</span>
        </div>
        <div>
          {step === 'analyzing' && <span>●</span>}
          {step === 'generating' && <span>● ●</span>}
          {step === 'formatting' && <span>● ● ●</span>}
          {step === 'complete' && <span>✓</span>}
        </div>
      </div>

      <button onClick={handleCancel}>
        {cancelConfirm ? 'Confirm Cancel' : 'Cancel'}
      </button>
    </div>
  );
}