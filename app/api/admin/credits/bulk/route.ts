import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import AuditLog from '@/models/AuditLog';
import { addCredits, deductCredits } from '@/lib/credits';

const bulkSchema = z.object({
  operation: z.enum(['add', 'remove']),
  userIds: z.array(z.string()).min(1).max(100),
  amount: z.number().int().positive(),
  reason: z.string().min(10).max(500),
  dryRun: z.boolean().optional().default(false),
  notifyUsers: z.boolean().optional().default(false),
});

async function bulkHandler(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = bulkSchema.parse(body);

    await connectDB();

    const users = await User.find({ _id: { $in: validatedData.userIds } });
    const foundIds = users.map((u) => u._id.toString());
    const notFound = validatedData.userIds.filter((id) => !foundIds.includes(id));

    if (validatedData.dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        willAffect: foundIds.length,
        notFound,
        operation: validatedData.operation,
        amount: validatedData.amount,
      });
    }

    const results = { success: [] as string[], failed: [] as { userId: string; error: string }[] };

    for (const userId of foundIds) {
      try {
        if (validatedData.operation === 'add') {
          await addCredits({
            userId,
            type: 'admin',
            amount: validatedData.amount,
            description: validatedData.reason,
          });
        } else {
          await deductCredits({
            userId,
            type: 'admin',
            amount: validatedData.amount,
            description: validatedData.reason,
          });
        }
        results.success.push(userId);
      } catch (error) {
        results.failed.push({
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    await AuditLog.create({
      adminId: payload.sub,
      action: `bulk_credit_${validatedData.operation}`,
      targetType: 'User',
      details: {
        affected: results.success.length,
        failed: results.failed.length,
        amount: validatedData.amount,
        reason: validatedData.reason,
      },
      success: results.failed.length === 0,
    });

    return NextResponse.json({
      success: true,
      results,
      notFound,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Bulk credits error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = bulkHandler;