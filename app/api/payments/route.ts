import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCreditCheckout } from '@/lib/credit-checkout';
import { createProCheckout } from '@/lib/pro-checkout';
import { getMongoDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getMongoDb();
    const [payments, subscription] = await Promise.all([
      db.collection('payments').find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(50).toArray(),
      db.collection('subscriptions').findOne({ userId: session.user.id, status: 'active' }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        payments: payments.map((p) => ({
          id: p._id.toString(),
          type: p.type,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          processor: p.processor,
          createdAt: p.createdAt,
        })),
        subscription: subscription ? {
          id: subscription._id.toString(),
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        } : null,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'buy_credits': {
        const { packId, credits, price, currency, processor } = body;
        const result = await createCreditCheckout({
          packId,
          credits,
          price,
          currency: currency || 'USD',
          processor,
          userId: session.user.id,
          userEmail: (session.user as any).email || '',
          userName: (session.user as any).name || '',
        });
        return NextResponse.json({ success: result.success, data: result });
      }
      case 'subscribe_pro': {
        const { plan, price, currency, processor, promoCode } = body;
        const result = await createProCheckout({
          plan,
          price,
          currency: currency || 'USD',
          processor,
          userId: session.user.id,
          userEmail: (session.user as any).email || '',
          userName: (session.user as any).name || '',
          promoCode,
        });
        return NextResponse.json({ success: result.success, data: result });
      }
      case 'cancel_subscription': {
        const { cancelUserSubscription } = await import('@/lib/subscription-manage');
        await cancelUserSubscription(session.user.id);
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Payment processing failed' }, { status: 500 });
  }
}
