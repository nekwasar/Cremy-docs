interface EditCreditTracker {
  promptCount: number;
  creditsUsed: number;
  lastDeductedAt: number | null;
}

const userEditCredits = new Map<string, EditCreditTracker>();

const PROMPTS_PER_CREDIT = 10;
const CREDIT_COST_PER_EDIT = 1;

export function getEditCreditTracker(userId: string): EditCreditTracker {
  if (!userEditCredits.has(userId)) {
    userEditCredits.set(userId, { promptCount: 0, creditsUsed: 0, lastDeductedAt: null });
  }
  return userEditCredits.get(userId)!;
}

export function trackEditPrompt(userId: string): {
  promptsUsed: number;
  creditsDeducted: boolean;
  remainingPrompts: number;
} {
  const tracker = getEditCreditTracker(userId);
  tracker.promptCount++;

  const creditsShouldBe = Math.floor(tracker.promptCount / PROMPTS_PER_CREDIT) * CREDIT_COST_PER_EDIT;
  const needsDeduction = creditsShouldBe > tracker.creditsUsed;

  if (needsDeduction) {
    tracker.creditsUsed += CREDIT_COST_PER_EDIT;
    tracker.lastDeductedAt = Date.now();
  }

  return {
    promptsUsed: tracker.promptCount,
    creditsDeducted: needsDeduction,
    remainingPrompts: PROMPTS_PER_CREDIT - (tracker.promptCount % PROMPTS_PER_CREDIT),
  };
}

export function getEditCreditsUsed(userId: string): number {
  return getEditCreditTracker(userId).creditsUsed;
}

export function resetEditTracker(userId: string): void {
  userEditCredits.delete(userId);
}

export function getRemainingFreePrompts(userId: string): number {
  const tracker = getEditCreditTracker(userId);
  const used = tracker.promptCount % PROMPTS_PER_CREDIT;
  return PROMPTS_PER_CREDIT - used;
}

export function willEditCostCredit(userId: string): boolean {
  return getRemainingFreePrompts(userId) <= 1;
}