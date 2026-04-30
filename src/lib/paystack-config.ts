import { getPaymentConfig } from '@/config/payment';

export function getPaystackKeys() {
  const config = getPaymentConfig();
  return {
    publicKey: config.paystack.publicKey,
    secretKey: config.paystack.secretKey,
    environment: config.paystack.environment,
  };
}

export function getPaystackBaseUrl(): string {
  return 'https://api.paystack.co';
}
