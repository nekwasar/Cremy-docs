import { PaymentProcessor } from './payment-processor';
import { ProcessorName } from '@/config/payment';
import { getMongoDb } from '@/lib/mongodb';

interface ProCheckoutOptions {
  plan: 'monthly' | 'yearly';
  price: number;
  currency: string;
  processor: ProcessorName;
  userId: string;
  userEmail: string;
  userName: string;
  promoCode?: string;
}

export async function createProCheckout(options: ProCheckoutOptions): Promise<{
  success: boolean;
  redirectUrl?: string;
  transactionId?: string;
  error?: string;
}> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const db = await getMongoDb();

  const paymentRecord = {
    userId: options.userId,
    type: 'subscription' as const,
    plan: options.plan,
    amount: options.price,
    currency: options.currency,
    processor: options.processor,
    status: 'pending' as const,
    promoCode: options.promoCode,
    createdAt: new Date(),
  };

  const result = await db.collection('payments').insertOne(paymentRecord);
  const paymentId = result.insertedId.toString();

  const planLabel = options.plan === 'monthly' ? 'Pro Monthly' : 'Pro Yearly';
  const result2 = await PaymentProcessor.createCheckout(options.processor, {
    amount: options.price,
    currency: options.currency,
    customerEmail: options.userEmail,
    customerName: options.userName,
    description: `${planLabel} Subscription`,
    metadata: { userId: options.userId, paymentId, type: 'subscription', plan: options.plan, promoCode: options.promoCode || '' },
    successUrl: `${appUrl}/pro/success?paymentId=${paymentId}`,
    cancelUrl: `${appUrl}/pro/cancel`,
  });

  if (result2.success) {
    await db.collection('payments').updateOne(
      { _id: result.insertedId },
      { $set: { transactionId: result2.transactionId } }
    );
  }

  return result2;
}
