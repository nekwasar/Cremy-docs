import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import CreditTransaction from '@/models/CreditTransaction';
import { withAuth, AuthUser } from '@/lib/auth';

const reportSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'tool']).optional().default('day'),
});

async function reportHandler(request: NextRequest, user: AuthUser) {
  try {
    const searchParams = request.nextUrl.searchParams();
    const validatedData = reportSchema.parse({
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      groupBy: searchParams.get('groupBy'),
    });

    await connectDB();

    const query: any = { 
      userId: user.sub,
      type: 'usage',
    };

    if (validatedData.startDate || validatedData.endDate) {
      query.createdAt = {};
      if (validatedData.startDate) {
        query.createdAt.$gte = validatedData.startDate;
      }
      if (validatedData.endDate) {
        query.createdAt.$lte = validatedData.endDate;
      }
    }

    const dateFormat = {
      day: '%Y-%m-%d',
      week: '%Y-%U',
      month: '%Y-%m',
    }[validatedData.groupBy];

    const breakdown = await CreditTransaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          totalCredits: { $sum: { $abs: '$amount' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const totalUsage = breakdown.reduce((sum, item) => sum + Math.abs(item.totalCredits), 0);

    return NextResponse.json({
      success: true,
      data: {
        breakdown,
        summary: {
          totalCredits: totalUsage,
          totalTransactions: breakdown.reduce((sum, item) => sum + item.count, 0),
          period: {
            start: validatedData.startDate,
            end: validatedData.endDate,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Report error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(reportHandler);