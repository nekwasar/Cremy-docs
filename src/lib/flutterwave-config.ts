import { getPaymentConfig } from '@/config/payment';

export function getFlutterwaveKeys() {
  const config = getPaymentConfig();
  return {
    publicKey: config.flutterwave.publicKey,
    secretKey: config.flutterwave.secretKey,
    encryptionKey: config.flutterwave.encryptionKey,
    environment: config.flutterwave.environment,
  };
}

export function getFlutterwaveBaseUrl(): string {
  const config = getPaymentConfig();
  return config.flutterwave.environment === 'production'
    ? 'https://api.flutterwave.com'
    : 'https://api.flutterwave.com';
}
