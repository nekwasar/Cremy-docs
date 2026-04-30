'use client';

interface ProPlanSelectProps {
  selected: 'monthly' | 'yearly' | null;
  onSelect: (plan: 'monthly' | 'yearly') => void;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyCredits: number;
  yearlyCredits: number;
}

export function ProPlanSelect({
  selected,
  onSelect,
  monthlyPrice,
  yearlyPrice,
  monthlyCredits,
  yearlyCredits,
}: ProPlanSelectProps) {
  return (
    <div>
      <h3>Choose Your Plan</h3>
      <div>
        <label>
          <input
            type="radio"
            name="plan"
            value="monthly"
            checked={selected === 'monthly'}
            onChange={() => onSelect('monthly')}
          />
          <div>
            <h4>Pro Monthly</h4>
            <p>${monthlyPrice}/month</p>
            <p>{monthlyCredits} credits/month</p>
          </div>
        </label>

        <label>
          <input
            type="radio"
            name="plan"
            value="yearly"
            checked={selected === 'yearly'}
            onChange={() => onSelect('yearly')}
          />
          <div>
            <h4>Pro Yearly</h4>
            <p>${yearlyPrice}/year</p>
            <p>{yearlyCredits} credits/year</p>
            <p>Save {Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100)}%</p>
          </div>
        </label>
      </div>
    </div>
  );
}