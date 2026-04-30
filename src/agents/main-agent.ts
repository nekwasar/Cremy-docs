import { analyzeIntent } from './intent-analyzer';
import { handleClarification } from './clarification-handler';
import { selectTool } from './tool-selector';
import { calculateCredits } from './credit-calculator';
import { assessCreditCapacity } from './credit-aware';
import { filterTask } from './task-filter';
import { executeToolChain } from './tool-chain';
import { getPageContext } from './page-context';
import { getFileContext } from './file-context';

interface AgentMessage {
  message: string;
  pageContext: string;
  fileData?: { id: string; name: string; type: string }[];
  sessionId: string;
  userId?: string;
}

interface AgentResponse {
  type: 'response' | 'clarification' | 'error' | 'rejection' | 'execution';
  message: string;
  reasoning?: string;
  options?: Array<{ id: string; label: string; description: string }>;
  toolUsed?: string;
  output?: any;
  creditInfo?: { estimated: number; remaining: number; canAfford: boolean };
  nextStep?: { action: string; target?: string };
}

export async function processAgentMessage(input: AgentMessage): Promise<AgentResponse> {
  const taskCheck = filterTask(input.message);
  if (!taskCheck.allowed) {
    return {
      type: 'rejection',
      message: taskCheck.message,
      reasoning: 'Task filter rejected non-document request',
    };
  }

  const intent = analyzeIntent(input.message);
  const reasoning = [
    `Intent detected: "${intent.primary.label}"`,
    ...intent.all.map((i) => `  - ${i.label} (confidence: ${(i.confidence * 100).toFixed(0)}%)`),
  ];

  if (intent.needsClarification) {
    const clarification = handleClarification(intent, input.message);
    return {
      type: 'clarification',
      message: clarification.message,
      reasoning: reasoning.join('\n'),
      options: clarification.options,
    };
  }

  const pageCtx = getPageContext(input.pageContext);
  const tool = selectTool(intent.primary, pageCtx);

  if (!tool) {
    return {
      type: 'response',
      message: `The "${intent.primary.label}" tool is not available on this page. Try the homepage for access to all tools.`,
      reasoning: reasoning.join('\n'),
      nextStep: { action: 'navigate', target: '/' },
    };
  }

  if (tool.requiresCredits) {
    const cost = calculateCredits(tool.id, input.message);
    const creditCheck = assessCreditCapacity(input.userId || '', cost);

    if (!creditCheck.canProceed) {
      return {
        type: 'response',
        message: creditCheck.message,
        reasoning: reasoning.join('\n'),
        creditInfo: { estimated: cost, remaining: creditCheck.remaining, canAfford: false },
      };
    }

    reasoning.push(`Credits: ${cost} needed, ${creditCheck.remaining} available`);
  }

  const fileCtx = getFileContext(input.fileData || [], input.message);

  return {
    type: 'execution',
    message: `Using ${tool.label} to ${intent.primary.label.toLowerCase()}`,
    reasoning: reasoning.join('\n'),
    toolUsed: tool.id,
    nextStep: {
      action: 'execute_tool',
      target: tool.id,
    },
  };
}
