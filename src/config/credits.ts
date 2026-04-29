export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  bonusCredits: number;
  isPopular?: boolean;
}

export const creditPackages: CreditPackage[] = [
  {
    id: 'starter-10',
    credits: 10,
    price: 4.99,
    bonusCredits: 0,
  },
  {
    id: 'basic-50',
    credits: 50,
    price: 19.99,
    bonusCredits: 0,
  },
  {
    id: 'pro-100',
    credits: 100,
    price: 34.99,
    bonusCredits: 10,
    isPopular: true,
  },
  {
    id: 'business-500',
    credits: 500,
    price: 149.99,
    bonusCredits: 75,
  },
  {
    id: 'enterprise-1000',
    credits: 1000,
    price: 249.99,
    bonusCredits: 200,
  },
];

export function getPackageById(id: string): CreditPackage | undefined {
  return creditPackages.find((p) => p.id === id);
}

export function getTotalCredits(credits: number, bonusCredits: number): number {
  return credits + bonusCredits;
}

export const PRO_MONTHLY_CREDITS = 500;
export const PRO_YEARLY_CREDITS = 6000;

export const PROMO_CODES: Record<string, { discount: number; maxUses?: number; usedCount?: number }> = {
  WELCOME20: { discount: 0.2, maxUses: 100 },
  SAVE10: { discount: 0.1 },
};

export function validatePromoCode(code: string): { valid: boolean; discount: number; message?: string } {
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) {
    return { valid: false, discount: 0, message: 'Invalid promo code' };
  }
  if (promo.maxUses && (promo.usedCount || 0) >= promo.maxUses) {
    return { valid: false, discount: 0, message: 'Promo code expired' };
  }
  return { valid: true, discount: promo.discount };
}