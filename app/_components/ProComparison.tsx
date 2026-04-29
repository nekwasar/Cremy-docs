'use client';

interface ProPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  credits: number;
  features: string[];
}

const PLANS: ProPlan[] = [
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: 14.99,
    period: '/month',
    credits: 200,
    features: ['200 credits/month', 'Unlimited documents', 'Priority support', 'No watermarks'],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    price: 119.99,
    period: '/year',
    credits: 2400,
    features: ['2400 credits/year', 'Unlimited documents', 'Priority support', 'No watermarks', 'Save 33% on monthly'],
  },
];

interface ProComparisonProps {
  onSelectPlan: (planId: string) => void;
  selectedPlan?: string;
}

export function ProComparison({ onSelectPlan, selectedPlan }: ProComparisonProps) {
  return (
    <div>
      {PLANS.map((plan) => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>${plan.price}{plan.period}</p>
          <p>{plan.credits} credits</p>
          <ul>
            {plan.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
          <button
            onClick={() => onSelectPlan(plan.id)}
            disabled={selectedPlan === plan.id}
          >
            {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
          </button>
        </div>
      ))}
    </div>
  );
}