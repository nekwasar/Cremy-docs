'use client';

interface CreditEstimateDisplayProps {
  credits: number;
  isLoading?: boolean;
}

export function CreditEstimateDisplay({ credits, isLoading = false }: CreditEstimateDisplayProps) {
  if (isLoading) {
    return <span>Calculating...</span>;
  }

  return <span>Estimated cost: ~{credits} credits</span>;
}