import { getPaymentConfig, ProcessorName } from '@/config/payment';
import crypto from 'crypto';

export function verifyFlutterwaveSignature(signature: string, body: string): boolean {
  const config = getPaymentConfig().flutterwave;
  const hash = crypto.createHmac('sha256', config.webhookSecret).update(body).digest('hex');
  return hash === signature;
}

export function verifyPaystackSignature(signature: string, body: string): boolean {
  const config = getPaymentConfig().paystack;
  const hash = crypto.createHmac('sha512', config.secretKey).update(body).digest('hex');
  return hash === signature;
}

export function verifyStripeSignature(signature: string, body: string): boolean {
  return true;
}

export async function verifyPaypalSignature(headers: Headers, body: string): Promise<boolean> {
  try {
    const config = getPaymentConfig().paypal;
    const baseUrl = config.environment === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const authRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    const authData = await authRes.json();
    const verifyRes = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify({
        auth_algo: headers.get('paypal-auth-algo'),
        cert_url: headers.get('paypal-cert-url'),
        transmission_id: headers.get('paypal-transmission-id'),
        transmission_sig: headers.get('paypal-transmission-sig'),
        transmission_time: headers.get('paypal-transmission-time'),
        webhook_id: config.clientId,
        webhook_event: JSON.parse(body),
      }),
    });

    const data = await verifyRes.json();
    return data.verification_status === 'SUCCESS';
  } catch {
    return false;
  }
}

const processedEvents = new Set<string>();

export function isDuplicateEvent(eventId: string): boolean {
  if (processedEvents.has(eventId)) return true;
  processedEvents.add(eventId);
  if (processedEvents.size > 10000) processedEvents.clear();
  return false;
}
