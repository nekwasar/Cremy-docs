import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import { withAuth, AuthUser } from '@/lib/auth';

const reportSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  format: z.enum(['json', 'csv']).default('json'),
});

async function reportHandler(request: NextRequest, user: AuthUser) {
  try {
    const { searchParams } = request.nextUrl;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'json';

    await connectDB();

    const userData = await User.findById(user.sub);
    if (!userData) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
        { status: 404 }
      );
    }

    const query: Record<string, unknown> = { userId: user.sub };
    const dateFilter: Record<string, Date> = {};

    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    if (Object.keys(dateFilter).length > 0) {
      query.createdAt = dateFilter;
    }

    const transactions = await CreditTransaction.find(query).sort({ createdAt: -1 });

    const usageByTool: Record<string, number> = {};
    const usageByDate: Record<string, number> = {};
    let totalUsage = 0;
    let totalPurchased = 0;
    let totalBonus = 0;

    for (const tx of transactions) {
      const dateKey = tx.createdAt.toISOString().split('T')[0];

      if (tx.type === 'usage') {
        totalUsage += Math.abs(tx.amount);
        const tool = tx.description?.replace('Credit usage: ', '') || 'unknown';
        usageByTool[tool] = (usageByTool[tool] || 0) + Math.abs(tx.amount);
        usageByDate[dateKey] = (usageByDate[dateKey] || 0) + Math.abs(tx.amount);
      } else if (tx.type === 'purchase') {
        totalPurchased += tx.amount;
      } else if (tx.type === 'bonus') {
        totalBonus += tx.amount;
      }
    }

    const report = {
      user: {
        email: userData.email,
        name: userData.name,
      },
      period: {
        start: startDate || 'All time',
        end: endDate || 'All time',
      },
      summary: {
        totalCredits: userData.credits || 0,
        totalUsed: totalUsage,
        totalPurchased,
        totalBonus,
      },
      byTool: usageByTool,
      byDate: usageByDate,
      transactions: transactions.map((tx) => ({
        id: tx._id,
        type: tx.type,
        amount: tx.amount,
        balance: tx.balance,
        description: tx.description,
        createdAt: tx.createdAt,
      })),
    };

    if (format === 'csv') {
      const headers = 'Date,Type,Amount,Balance,Description\n';
      const rows = report.transactions
        .map(
          (tx) =>
            `${tx.createdAt.toISOString()},${tx.type},${tx.amount},${tx.balance},"${tx.description}"`
        )
        .join('\n');

      return new NextResponse(headers + rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="credit-report-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(reportHandler);