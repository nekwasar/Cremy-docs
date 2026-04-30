export interface PaymentProcessorConfig {
  flutterwave: {
    publicKey: string;
    secretKey: string;
    encryptionKey: string;
    environment: 'sandbox' | 'production';
    webhookSecret: string;
  };
  paystack: {
    publicKey: string;
    secretKey: string;
    environment: 'sandbox' | 'production';
  };
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    environment: 'sandbox' | 'production';
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'production';
  };
}

export function getPaymentConfig(): PaymentProcessorConfig {
  return {
    flutterwave: {
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
      encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY || '',
      environment: (process.env.FLUTTERWAVE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET || '',
    },
    paystack: {
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
      secretKey: process.env.PAYSTACK_SECRET_KEY || '',
      environment: (process.env.PAYSTACK_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    },
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'),
    },
    paypal: {
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
      environment: (process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    },
  };
}

export type ProcessorName = 'flutterwave' | 'paystack' | 'stripe' | 'paypal';
