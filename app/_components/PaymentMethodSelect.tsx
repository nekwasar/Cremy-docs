'use client';

import type { ProcessorName } from '@/config/payment';
import { detectUserRegion } from '@/lib/region-detect';

interface PaymentMethodSelectProps {
  value: ProcessorName | null;
  onChange: (processor: ProcessorName) => void;
}

const PROCESSOR_LABELS: Record<ProcessorName, string> = {
  flutterwave: 'Flutterwave (Card, Bank Transfer, Mobile Money)',
  paystack: 'Paystack (Card, Bank Transfer, USSD)',
  stripe: 'Stripe (Card, Apple Pay, Google Pay)',
  paypal: 'PayPal (PayPal Wallet)',
};

export function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  const { recommendedProcessors } = detectUserRegion();

  return (
    <div>
      <h3>Select Payment Method</h3>
      <div>
        {recommendedProcessors.map((proc) => (
          <label key={proc}>
            <input
              type="radio"
              name="processor"
              value={proc}
              checked={value === proc}
              onChange={() => onChange(proc as ProcessorName)}
            />
            <span>{PROCESSOR_LABELS[proc as ProcessorName]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}