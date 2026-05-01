import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import CreditTransaction from '@/models/CreditTransaction';
import { withAuth, AuthUser } from '@/lib/auth';

const historySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  type: z.enum(['purchase', 'usage', 'bonus', 'refund', 'admin', 'referral']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

async function historyHandler(request: NextRequest, user: AuthUser) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const validatedData = historySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      type: searchParams.get('type'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    });

    await connectDB();

    const query: any = { userId: user.sub };

    if (validatedData.type) {
      query.type = validatedData.type;
    }

    if (validatedData.startDate || validatedData.endDate) {
      query.createdAt = {};
      if (validatedData.startDate) {
        query.createdAt.$gte = validatedData.startDate;
      }
      if (validatedData.endDate) {
        query.createdAt.$lte = validatedData.endDate;
      }
    }

    const skip = (validatedData.page - 1) * validatedData.limit;
    const [transactions, total] = await Promise.all([
      CreditTransaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(validatedData.limit)
        .lean(),
      CreditTransaction.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page: validatedData.page,
        limit: validatedData.limit,
        total,
        totalPages: Math.ceil(total / validatedData.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Get history error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(historyHandler);