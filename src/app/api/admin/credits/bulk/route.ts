import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';
import { withAuth, AuthUser } from '@/lib/auth';

const bulkSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user required'),
  operation: z.enum(['add', 'remove']),
  amount: z.number().int().positive('Amount must be positive').min(1),
  reason: z.string().min(1, 'Reason required'),
  dryRun: z.boolean().default(false),
  notifyUsers: z.boolean().default(true),
});

async function bulkHandler(request: NextRequest, user: AuthUser) {
  try {
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Admin access required', code: 'ADMIN_REQUIRED' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = bulkSchema.parse(body);

    await connectDB();

    const results: { userId: string; success: boolean; error?: string; creditsBefore?: number; creditsAfter?: number }[] = [];

    for (const userId of validatedData.userIds) {
      const targetUser = await User.findById(userId);
      if (!targetUser) {
        results.push({ userId, success: false, error: 'User not found' });
        continue;
      }

      const creditsBefore = targetUser.credits || 0;
      let creditsAfter: number;

      if (validatedData.operation === 'add') {
        creditsAfter = creditsBefore + validatedData.amount;
      } else {
        creditsAfter = Math.max(0, creditsBefore - validatedData.amount);
      }

      if (validatedData.dryRun) {
        results.push({ userId, success: true, creditsBefore, creditsAfter });
        continue;
      }

      await User.findByIdAndUpdate(userId, { credits: creditsAfter });

      await CreditTransaction.create({
        userId,
        type: validatedData.operation === 'add' ? 'bonus' : 'usage',
        amount: validatedData.operation === 'add' ? validatedData.amount : -validatedData.amount,
        balance: creditsAfter,
        description: `${validatedData.operation === 'add' ? 'Credit bonus' : 'Credit adjustment'}: ${validatedData.reason}`,
        creditsBefore,
        creditsAfter,
        metadata: {
          adminOperation: true,
          reason: validatedData.reason,
          performedBy: user.sub,
        },
      });

      results.push({ userId, success: true, creditsBefore, creditsAfter });
    }

    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      data: {
        total: results.length,
        succeeded: successCount,
        failed: failedCount,
        dryRun: validatedData.dryRun,
        results,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', details: error.errors, code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Bulk operation error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const POST = withAuth(bulkHandler);