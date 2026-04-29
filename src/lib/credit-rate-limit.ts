import { getUserCredits } from '@/lib/credits';
import { getToolCost } from '@/lib/credit-deduction';

export interface CreditLimitResult {
  allowed: boolean;
  remainingCredits: number;
  cost: number;
  message?: string;
}

export async function checkCreditLimit(userId: string, toolSlug: string): Promise<CreditLimitResult> {
  const cost = getToolCost(toolSlug);
  const balance = await getUserCredits(userId);

  if (balance < cost) {
    return {
      allowed: false,
      remainingCredits: balance,
      cost,
      message: `Insufficient credits. This action requires ${cost} credits but you have ${balance}.`,
    };
  }

  return {
    allowed: true,
    remainingCredits: balance,
    cost,
  };
}

export async function checkCreditsBeforeAction(
  userId: string,
  actionType: string,
  customCost?: number
): Promise<CreditLimitResult> {
  const defaultCosts: Record<string, number> = {
    'generate-document': 1,
    'voice-to-document': 2,
    'convert-format': 1,
    'extract-text': 1,
    'translate': 2,
    'summarize': 2,
  };

  const cost = customCost || defaultCosts[actionType] || 1;
  const balance = await getUserCredits(userId);

  if (balance < cost) {
    return {
      allowed: false,
      remainingCredits: balance,
      cost,
      message: `Action requires ${cost} credits. You have ${balance} credits remaining.`,
    };
  }

  return {
    allowed: true,
    remainingCredits: balance,
    cost,
  };
}

export function formatCreditLimitError(result: CreditLimitResult): string {
  if (!result.allowed) {
    return `Credit limit exceeded. ${result.message} Upgrade to Pro for unlimited credits.`;
  }
  return '';
}