import { getPaymentConfig } from '@/config/payment';

export function getStripeKeys() {
  const config = getPaymentConfig();
  return {
    publishableKey: config.stripe.publishableKey,
    secretKey: config.stripe.secretKey,
    webhookSecret: config.stripe.webhookSecret,
    environment: config.stripe.environment,
  };
}
