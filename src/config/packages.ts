import {
  creditPackages,
  CreditPackage,
  getPackageById,
  getTotalCredits,
} from './credits';

interface VolumeDiscount {
  threshold: number;
  discount: number;
}

const VOLUME_DISCOUNTS: VolumeDiscount[] = [
  { threshold: 100, discount: 0.05 },
  { threshold: 500, discount: 0.10 },
  { threshold: 1000, discount: 0.15 },
  { threshold: 5000, discount: 0.20 },
];

const FIRST_TIME_BONUS = 10;

export function getPackages(): CreditPackage[] {
  return creditPackages;
}

export function getPackage(id: string): CreditPackage | undefined {
  return getPackageById(id);
}

export function calculateVolumeDiscount(totalPrice: number): number {
  for (let i = VOLUME_DISCOUNTS.length - 1; i >= 0; i--) {
    if (totalPrice >= VOLUME_DISCOUNTS[i].threshold) {
      return VOLUME_DISCOUNTS[i].discount;
    }
  }
  return 0;
}

export function calculateFirstTimeBonus(isFirstPurchase: boolean): number {
  return isFirstPurchase ? FIRST_TIME_BONUS : 0;
}

export function calculateTotalPrice(
  packageId: string,
  isFirstPurchase: boolean = false,
  quantity: number = 1
): {
  basePrice: number;
  volumeDiscount: number;
  finalPrice: number;
  totalCredits: number;
  bonusCredits: number;
} {
  const pkg = getPackageById(packageId);
  if (!pkg) {
    throw new Error(`Package ${packageId} not found`);
  }

  const basePrice = pkg.price * quantity;
  const volumeDiscount = calculateVolumeDiscount(basePrice);
  const finalPrice = basePrice * (1 - volumeDiscount);
  const bonusCredits = isFirstPurchase
    ? pkg.bonusCredits + FIRST_TIME_BONUS
    : pkg.bonusCredits;
  const totalCredits = getTotalCredits(pkg.credits * quantity, bonusCredits);

  return {
    basePrice,
    volumeDiscount,
    finalPrice,
    totalCredits,
    bonusCredits,
  };
}

export function getProMonthlyCredits(): number {
  return 200;
}

export function getProYearlyCredits(): number {
  return 2400;
}

export function getMinimumPurchaseCredits(): number {
  return 10;
}

export function getMaximumPurchaseCredits(): number {
  return 10000;
}