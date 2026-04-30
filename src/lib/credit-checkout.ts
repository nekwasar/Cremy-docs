import { PaymentProcessor } from './payment-processor';
import { ProcessorName } from '@/config/payment';
import { getMongoDb } from '@/lib/mongodb';

interface CreditCheckoutOptions {
  packId: string;
  credits: number;
  price: number;
  currency: string;
  processor: ProcessorName;
  userId: string;
  userEmail: string;
  userName: string;
}

export async function createCreditCheckout(options: CreditCheckoutOptions): Promise<{
  success: boolean;
  redirectUrl?: string;
  transactionId?: string;
  error?: string;
}> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const db = await getMongoDb();
  const paymentRecord = {
    userId: options.userId,
    type: 'credit_purchase' as const,
    packId: options.packId,
    credits: options.credits,
    amount: options.price,
    currency: options.currency,
    processor: options.processor,
    status: 'pending' as const,
    createdAt: new Date(),
  };

  const result = await db.collection('payments').insertOne(paymentRecord);
  const paymentId = result.insertedId.toString();

  const result2 = await PaymentProcessor.createCheckout(options.processor, {
    amount: options.price,
    currency: options.currency,
    customerEmail: options.userEmail,
    customerName: options.userName,
    description: `${options.credits} Credits Pack`,
    metadata: { userId: options.userId, paymentId, type: 'credit_purchase', packId: options.packId },
    successUrl: `${appUrl}/buy-credits/success?paymentId=${paymentId}`,
    cancelUrl: `${appUrl}/buy-credits/cancel`,
  });

  if (result2.success) {
    await db.collection('payments').updateOne(
      { _id: result.insertedId },
      { $set: { transactionId: result2.transactionId } }
    );
  }

  return result2;
}
