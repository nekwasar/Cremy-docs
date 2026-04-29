import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import CreditTransaction from '@/models/CreditTransaction';
import User from '@/models/User';
import { withAuth, AuthUser } from '@/lib/auth';

const historySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  type: z.enum(['usage', 'purchase', 'bonus', 'refund', 'all']).default('all'),
});

async function historyHandler(request: NextRequest, user: AuthUser) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || 'all';

    const { valid: parsedType } = historySchema.parse({ page, limit, type });

    await connectDB();

    const query: Record<string, unknown> = { userId: user.sub };
    if (parsedType !== 'all') {
      query.type = parsedType;
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      CreditTransaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CreditTransaction.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        transactions: transactions.map((t) => ({
          id: t._id,
          type: t.type,
          amount: t.amount,
          balance: t.balance,
          description: t.description,
          createdAt: t.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(historyHandler);