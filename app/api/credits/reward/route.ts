import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getMongoDb();

    const existingReward = await db.collection('credit_transactions').findOne({
      userId: session.user.id,
      type: 'signup_reward',
    });

    if (existingReward) {
      return NextResponse.json({
        success: false,
        error: 'Reward already claimed',
        data: { claimed: true },
      }, { status: 409 });
    }

    const rewardAmount = 10;

    await db.collection('users').updateOne(
      { _id: session.user.id },
      { $inc: { credits: rewardAmount } }
    );

    await db.collection('credit_transactions').insertOne({
      userId: session.user.id,
      amount: rewardAmount,
      type: 'signup_reward',
      description: 'Email verification reward',
      balance: 0,
      creditsBefore: 0,
      creditsAfter: rewardAmount,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        credits: rewardAmount,
        message: `${rewardAmount} credits added`,
      },
    });
  } catch (error) {
    console.error('Credit reward error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getMongoDb();

    const reward = await db.collection('credit_transactions').findOne({
      userId: session.user.id,
      type: 'signup_reward',
    });

    return NextResponse.json({
      success: true,
      data: {
        claimed: !!reward,
        amount: reward?.amount || 0,
      },
    });
  } catch (error) {
    console.error('Credit reward check error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}