export function handlePaymentError(code: string): string {
  switch (code) {
    case 'card_declined': return 'Card was declined. Please try a different card.';
    case 'insufficient_funds': return 'Insufficient funds. Please try a different card.';
    case 'expired_card': return 'Card has expired. Please use a valid card.';
    case 'invalid_cvc': return 'Invalid security code. Please check and try again.';
    case 'processing_error': return 'Payment processing error. Please try again.';
    case 'network_error': return 'Network error. Please check your connection and retry.';
    case 'timeout': return 'Payment timed out. Please try again.';
    case 'fraud': return 'Payment flagged for security. Please try a different method.';
    case 'currency_not_supported': return 'Currency not supported. Please try a different processor.';
    default: return 'Payment failed. Please try again or use a different payment method.';
  }
}

export async function processRefund(
  processor: string,
  transactionId: string,
  amount: number
): Promise<boolean> {
  try {
    const db = await (await import('@/lib/mongodb')).getMongoDb();
    const payment = await db.collection('payments').findOne({ transactionId });
    if (!payment || payment.status === 'refunded') return false;

    await db.collection('payments').updateOne(
      { transactionId },
      { $set: { status: 'refunded', refundedAt: new Date(), refundAmount: amount } }
    );

    if (payment.userId) {
      await db.collection('credit_transactions').insertOne({
        userId: payment.userId,
        type: 'refund',
        amount: -amount,
        description: `Refund for ${transactionId}`,
        createdAt: new Date(),
      });
    }

    return true;
  } catch {
    return false;
  }
}
