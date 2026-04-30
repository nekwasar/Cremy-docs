import { getMongoDb } from '@/lib/mongodb';

export async function validatePromoCode(code: string): Promise<{
  valid: boolean;
  discount: number;
  type: 'percentage' | 'fixed';
  error?: string;
}> {
  const db = await getMongoDb();
  const promo = await db.collection('promo_codes').findOne({ code: code.toUpperCase(), isActive: true });

  if (!promo) {
    return { valid: false, discount: 0, type: 'percentage', error: 'Invalid promo code' };
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { valid: false, discount: 0, type: 'percentage', error: 'Promo code expired' };
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return { valid: false, discount: 0, type: 'percentage', error: 'Promo code usage limit reached' };
  }

  return {
    valid: true,
    discount: promo.discount,
    type: promo.type || 'percentage',
  };
}

export async function applyPromoCode(code: string, userId: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection('promo_codes').updateOne(
    { code: code.toUpperCase() },
    { $inc: { usedCount: 1 } }
  );
}

export async function hasUserMadePurchase(userId: string): Promise<boolean> {
  const db = await getMongoDb();
  const purchase = await db.collection('payments').findOne({
    userId,
    status: 'completed',
  });
  return !!purchase;
}

export function getFirstTimeDiscount(): number {
  return 0.1;
}
