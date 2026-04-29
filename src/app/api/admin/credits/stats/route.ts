import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import { withAuth, AuthUser } from '@/lib/auth';

async function adminStatsHandler(request: NextRequest, user: AuthUser) {
  try {
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Admin access required', code: 'ADMIN_REQUIRED' } },
        { status: 403 }
      );
    }

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    const [totalCredits, monthlyCredits, dailyCredits, activeUsers] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$credits' },
          },
        },
      ]),
      CreditTransaction.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, type: { $in: ['usage', 'purchase'] } } },
        {
          $group: {
            _id: null,
            used: { $sum: { $abs: '$amount' } },
            count: { $sum: 1 },
          },
        },
      ]),
      CreditTransaction.aggregate([
        { $match: { createdAt: { $gte: startOfDay }, type: { $in: ['usage', 'purchase'] } },
        {
          $group: {
            _id: null,
            used: { $sum: { $abs: '$amount' } },
            count: { $sum: 1 },
          },
        },
      ]),
      User.countDocuments({ credits: { $gt: 0 } }),
    ]);

    const topConsumers = await CreditTransaction.aggregate([
      { $match: { type: 'usage', createdAt: { $gte: startOfMonth } } },
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
          email: '$user.email',
          name: '$user.name',
          totalUsed: 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalCreditsInSystem: totalCredits[0]?.total || 0,
        creditsUsedThisMonth: monthlyCredits[0]?.used || 0,
        transactionsThisMonth: monthlyCredits[0]?.count || 0,
        creditsUsedToday: dailyCredits[0]?.used || 0,
        transactionsToday: dailyCredits[0]?.count || 0,
        activeUsersWithCredits: activeUsers,
        topConsumers,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(adminStatsHandler);