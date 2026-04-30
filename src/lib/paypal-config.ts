import { getPaymentConfig } from '@/config/payment';

export function getPayPalCredentials() {
  const config = getPaymentConfig();
  return {
    clientId: config.paypal.clientId,
    clientSecret: config.paypal.clientSecret,
    environment: config.paypal.environment,
  };
}

export function getPayPalBaseUrl(): string {
  const config = getPaymentConfig();
  return config.paypal.environment === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}
