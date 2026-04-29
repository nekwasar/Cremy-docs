import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  try {
    const { jwtService } = await import('@/services/jwt');
    const payload = jwtService.verifyAccessToken(token);

    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Admin access required', code: 'UNAUTHORIZED' } },
        { status: 403 }
      );
    }

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalCredits,
      usersWithCredits,
      creditsUsedThisMonth,
      creditsPurchasedThisMonth,
      creditsUsedLastMonth,
      topConsumers,
    ] = await Promise.all([
      User.aggregate([
        { $group: { _id: null, total: { $sum: '$credits' } } },
      ]),
      User.countDocuments({ credits: { $gt: 0 } }),
      CreditTransaction.aggregate([
        { $match: { type: 'usage', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
      ]),
      CreditTransaction.aggregate([
        { $match: { type: 'purchase', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      CreditTransaction.aggregate([
        { $match: { type: 'usage', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
      ]),
      CreditTransaction.aggregate([
        { $match: { type: 'usage' } },
        {
          $group: {
            _id: '$userId',
            totalUsed: { $sum: { $abs: '$amount' } },
          },
        },
        { $sort: { totalUsed: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            email: '$user.email',
            totalUsed: 1,
          },
        },
      ]),
    ]);

    const monthlyChange = creditsUsedLastMonth[0]?.total || 0;
    const currentMonthUsage = creditsUsedThisMonth[0]?.total || 0;
    const percentChange = monthlyChange > 0 
      ? ((currentMonthUsage - monthlyChange) / monthlyChange) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalCredits: totalCredits[0]?.total || 0,
        usersWithCredits,
        creditsUsedThisMonth: currentMonthUsage,
        creditsPurchasedThisMonth: creditsPurchasedThisMonth[0]?.total || 0,
        monthlyChange: Math.round(percentChange * 10) / 10,
        topConsumers,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}