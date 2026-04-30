import { NextRequest, NextResponse } from 'next/server';
import { verifyFlutterwaveSignature, isDuplicateEvent } from '@/lib/webhook-handler';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('verif-hash') || '';
    const eventId = request.headers.get('x-request-id') || `fw-${Date.now()}`;

    if (!verifyFlutterwaveSignature(signature, body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (isDuplicateEvent(eventId)) {
      return NextResponse.json({ received: true });
    }

    const event = JSON.parse(body);
    const db = await getMongoDb();

    if (event.event === 'charge.completed' && event.data?.status === 'successful') {
      const txRef = event.data.tx_ref;
      const payment = await db.collection('payments').findOne({ transactionId: event.data.id?.toString() });

      if (payment && payment.status !== 'completed') {
        await db.collection('payments').updateOne(
          { _id: payment._id },
          { $set: { status: 'completed', completedAt: new Date() } }
        );

        if (payment.type === 'credit_purchase') {
          await db.collection('users').updateOne(
            { _id: payment.userId },
            { $inc: { credits: payment.credits } }
          );
        }

        if (payment.type === 'subscription') {
          await db.collection('subscriptions').updateOne(
            { userId: payment.userId },
            {
              $set: {
                userId: payment.userId,
                plan: payment.plan,
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + (payment.plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
                amount: payment.amount,
                paymentMethod: 'flutterwave',
                updatedAt: new Date(),
              },
            },
            { upsert: true }
          );
          await db.collection('users').updateOne(
            { _id: payment.userId },
            { $set: { role: 'pro' }, $inc: { credits: payment.plan === 'yearly' ? 2400 : 200 } }
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
