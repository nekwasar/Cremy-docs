import { deductCredits, refundCredits } from './credits';
import Document from '@/models/Document';

export interface ToolDefinition {
  slug: string;
  name: string;
  creditsCost: number;
}

export const toolCreditCosts: Record<string, number> = {
  'generate-document': 1,
  'convert-format': 1,
  'voice-to-document': 2,
  'extract-text': 1,
  'merge-documents': 1,
  'split-document': 1,
  'translate': 2,
  'summarize': 2,
};

export function getToolCost(toolSlug: string): number {
  return toolCreditCosts[toolSlug] || 1;
}

export interface DeductCreditsOnToolUseOptions {
  userId: string;
  toolSlug: string;
  documentId?: string;
  inputData?: Record<string, any>;
}

export async function deductCreditsOnToolUse(
  options: DeductCreditsOnToolUseOptions
): Promise<{ success: boolean; balance: number; creditsUsed: number; error?: string }> {
  const creditsCost = getToolCost(options.toolSlug);

  const result = await deductCredits({
    userId: options.userId,
    type: 'usage',
    amount: creditsCost,
    description: `Tool: ${options.toolSlug}`,
    referenceModel: 'Document',
  });

  if (!result.success) {
    return {
      success: false,
      balance: result.balance,
      creditsUsed: 0,
      error: result.message || 'Insufficient credits',
    };
  }

  return {
    success: true,
    balance: result.balance,
    creditsUsed: creditsCost,
  };
}

export async function refundCreditsOnFailure(
  userId: string,
  toolSlug: string,
  documentId?: string
): Promise<{ success: boolean; refundedCredits: number }> {
  const creditsCost = getToolCost(toolSlug);

  const result = await refundCredits({
    userId,
    type: 'refund',
    amount: creditsCost,
    description: `Refund: ${toolSlug} failed`,
  });

  return {
    success: result.success,
    refundedCredits: result.success ? creditsCost : 0,
  };
}

export async function deductCreditsForBatch(
  operations: DeductCreditsOnToolUseOptions[]
): Promise<{
  successful: { userId: string; creditsUsed: number }[];
  failed: { userId: string; error: string }[];
}> {
  const results = await Promise.all(
    operations.map(async (op) => {
      try {
        const result = await deductCreditsOnToolUse(op);
        if (result.success) {
          return { userId: op.userId, creditsUsed: result.creditsUsed, error: null };
        }
        return { userId: op.userId, creditsUsed: 0, error: result.error || 'Failed' };
      } catch (error) {
        return {
          userId: op.userId,
          creditsUsed: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  return {
    successful: results.filter((r) => r.error === null),
    failed: results.filter((r) => r.error !== null).map((r) => ({ userId: r.userId, error: r.error! })),
  };
}