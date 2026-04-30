'use client';

interface FormatCreditCostProps {
  creditCost: number;
}

export function FormatCreditCost({ creditCost }: FormatCreditCostProps) {
  return (
    <div>
      <span>Credit Cost: {creditCost} credits</span>
    </div>
  );
}