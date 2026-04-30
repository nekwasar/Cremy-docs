import { getPaymentConfig, ProcessorName } from '@/config/payment';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
}

interface CheckoutOptions {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  description: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

export class PaymentProcessor {
  static async createCheckout(
    processor: ProcessorName,
    options: CheckoutOptions
  ): Promise<PaymentResult> {
    switch (processor) {
      case 'flutterwave':
        return this.flutterwaveCheckout(options);
      case 'paystack':
        return this.paystackCheckout(options);
      case 'stripe':
        return this.stripeCheckout(options);
      case 'paypal':
        return this.paypalCheckout(options);
      default:
        return { success: false, error: 'Invalid processor' };
    }
  }

  private static async flutterwaveCheckout(options: CheckoutOptions): Promise<PaymentResult> {
    const config = getPaymentConfig().flutterwave;
    try {
      const response = await fetch(
        `https://api.${config.environment === 'production' ? '' : 'sandbox.'}flutterwave.com/v3/payments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.secretKey}`,
          },
          body: JSON.stringify({
            tx_ref: `tx-${Date.now()}`,
            amount: options.amount,
            currency: options.currency,
            redirect_url: options.successUrl,
            customer: { email: options.customerEmail, name: options.customerName },
            customizations: { title: options.description },
            meta: options.metadata,
          }),
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        return { success: true, redirectUrl: data.data.link, transactionId: data.data.id };
      }
      return { success: false, error: data.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private static async paystackCheckout(options: CheckoutOptions): Promise<PaymentResult> {
    const config = getPaymentConfig().paystack;
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.secretKey}`,
        },
        body: JSON.stringify({
          email: options.customerEmail,
          amount: Math.round(options.amount * 100),
          currency: options.currency,
          callback_url: options.successUrl,
          metadata: options.metadata,
        }),
      });
      const data = await response.json();
      if (data.status) {
        return { success: true, redirectUrl: data.data.authorization_url, transactionId: data.data.reference };
      }
      return { success: false, error: data.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private static async stripeCheckout(options: CheckoutOptions): Promise<PaymentResult> {
    const config = getPaymentConfig().stripe;
    try {
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${config.secretKey}`,
        },
        body: new URLSearchParams({
          'line_items[0][price_data][currency]': options.currency,
          'line_items[0][price_data][product_data][name]': options.description,
          'line_items[0][price_data][unit_amount]': Math.round(options.amount * 100).toString(),
          'line_items[0][quantity]': '1',
          mode: 'payment',
          success_url: options.successUrl,
          cancel_url: options.cancelUrl,
          customer_email: options.customerEmail,
          'metadata[userId]': options.metadata.userId || '',
        }).toString(),
      });
      const data = await response.json();
      if (data.url) {
        return { success: true, redirectUrl: data.url, transactionId: data.id };
      }
      return { success: false, error: data.error?.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private static async paypalCheckout(options: CheckoutOptions): Promise<PaymentResult> {
    const config = getPaymentConfig().paypal;
    const baseUrl = config.environment === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    try {
      const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
      });
      const authData = await authResponse.json();

      const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.access_token}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: { currency_code: options.currency, value: options.amount.toFixed(2) },
            description: options.description,
          }],
          application_context: {
            return_url: options.successUrl,
            cancel_url: options.cancelUrl,
          },
        }),
      });
      const orderData = await orderResponse.json();

      const approveLink = orderData.links?.find((l: any) => l.rel === 'approve');
      if (approveLink) {
        return { success: true, redirectUrl: approveLink.href, transactionId: orderData.id };
      }
      return { success: false, error: 'PayPal order creation failed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async verifyPayment(processor: ProcessorName, transactionId: string): Promise<boolean> {
    const config = getPaymentConfig();
    try {
      switch (processor) {
        case 'flutterwave': {
          const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
            headers: { Authorization: `Bearer ${config.flutterwave.secretKey}` },
          });
          const data = await res.json();
          return data.status === 'success' && data.data?.status === 'successful';
        }
        case 'paystack': {
          const res = await fetch(`https://api.paystack.co/transaction/verify/${transactionId}`, {
            headers: { Authorization: `Bearer ${config.paystack.secretKey}` },
          });
          const data = await res.json();
          return data.status && data.data?.status === 'success';
        }
        case 'stripe': {
          const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${transactionId}`, {
            headers: { Authorization: `Bearer ${config.stripe.secretKey}` },
          });
          const data = await res.json();
          return data.payment_status === 'paid';
        }
        case 'paypal': {
          const authRes = await fetch(
            `${config.paypal.environment === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'}/v1/oauth2/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${config.paypal.clientId}:${config.paypal.clientSecret}`).toString('base64')}`,
              },
              body: 'grant_type=client_credentials',
            }
          );
          const authData = await authRes.json();
          const res = await fetch(
            `${config.paypal.environment === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'}/v2/checkout/orders/${transactionId}`,
            { headers: { Authorization: `Bearer ${authData.access_token}` } }
          );
          const data = await res.json();
          return data.status === 'COMPLETED';
        }
        default:
          return false;
      }
    } catch {
      return false;
    }
  }
}
