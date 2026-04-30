'use client';

interface CreditPack {
  id: string;
  credits: number;
  price: number;
  bonusCredits: number;
  isPopular?: boolean;
}

interface CreditPackSelectProps {
  packs: CreditPack[];
  selected: string | null;
  onSelect: (packId: string) => void;
}

export function CreditPackSelect({ packs, selected, onSelect }: CreditPackSelectProps) {
  return (
    <div>
      <h3>Select Credit Pack</h3>
      <div>
        {packs.map((pack) => (
          <label key={pack.id}>
            <input
              type="radio"
              name="pack"
              value={pack.id}
              checked={selected === pack.id}
              onChange={() => onSelect(pack.id)}
            />
            <span>
              {pack.credits} Credits{pack.bonusCredits > 0 ? ` (+${pack.bonusCredits} bonus)` : ''}
            </span>
            <span>${pack.price}</span>
            {pack.isPopular && <span>Popular</span>}
          </label>
        ))}
      </div>
    </div>
  );
}