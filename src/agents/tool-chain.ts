interface ChainStep {
  toolId: string;
  input: string;
  output?: any;
  status: 'pending' | 'executing' | 'complete' | 'failed';
  requiresPageChange?: string;
}

interface ChainResult {
  success: boolean;
  steps: ChainStep[];
  currentStep?: ChainStep;
  redirect?: { page: string; countdown: number; message: string };
}

export function parseToolChain(message: string): ChainStep[] {
  const steps: ChainStep[] = [];
  const lower = message.toLowerCase();

  if (lower.includes('convert') && (lower.includes('translate') || lower.includes('spanish') || lower.includes('french'))) {
    if (message.indexOf('convert') < message.indexOf('translate')) {
      steps.push({ toolId: 'convert', input: message, status: 'pending', requiresPageChange: '/translate' });
      steps.push({ toolId: 'translate', input: message, status: 'pending' });
    } else {
      steps.push({ toolId: 'translate', input: message, status: 'pending', requiresPageChange: '/convert' });
      steps.push({ toolId: 'convert', input: message, status: 'pending' });
    }
  }

  if (lower.includes('translate') && lower.includes('compress')) {
    steps.push({ toolId: 'translate', input: message, status: 'pending' });
    steps.push({ toolId: 'compress', input: message, status: 'pending' });
  }

  if (lower.includes('merge') && lower.includes('compress')) {
    steps.push({ toolId: 'merge', input: message, status: 'pending' });
    steps.push({ toolId: 'compress', input: message, status: 'pending' });
  }

  if (lower.includes('and') && lower.includes('then')) {
    const parts = message.split(/\s+and\s+|\s+then\s+/);
    for (const part of parts) {
      if (part.trim()) {
        steps.push({ toolId: 'generate_command', input: part.trim(), status: 'pending' });
      }
    }
  }

  return steps;
}

export function getNextChainStep(steps: ChainStep[]): ChainStep | null {
  return steps.find((s) => s.status === 'pending') || null;
}

export function buildChainRedirect(step: ChainStep): ChainResult['redirect'] {
  if (step.requiresPageChange) {
    return {
      page: step.requiresPageChange,
      countdown: 5,
      message: `Step completed. Redirecting to continue with ${step.toolId}...`,
    };
  }
  return undefined;
}
