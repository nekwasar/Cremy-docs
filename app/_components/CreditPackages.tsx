'use client';

import type { CreditPackage } from '@/config/credits';

interface CreditPackagesProps {
  packages: CreditPackage[];
  onPurchase: (packageId: string) => void;
  selectedPackage?: string;
}

export function CreditPackages({ packages, onPurchase, selectedPackage }: CreditPackagesProps) {
  return (
    <div>
      {packages.map((pkg) => (
        <div key={pkg.id}>
          <h3>{pkg.credits} Credits</h3>
          {pkg.isPopular && <span>Popular</span>}
          <p>${pkg.price}</p>
          {pkg.bonusCredits > 0 && (
            <p>+{pkg.bonusCredits} bonus credits</p>
          )}
          <button
            onClick={() => onPurchase(pkg.id)}
            disabled={selectedPackage === pkg.id}
          >
            {selectedPackage === pkg.id ? 'Selected' : 'Purchase'}
          </button>
        </div>
      ))}
    </div>
  );
}