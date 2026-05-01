import connectDB from '@/lib/mongodb';
import CreditTransaction from '@/models/CreditTransaction';
import User from '@/models/User';

interface AuditEntry {
  userId: string;
  action: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logCreditOperation(entry: AuditEntry): Promise<void> {
  await connectDB();

  const user = await User.findById(entry.userId);
  
  await CreditTransaction.create({
    userId: entry.userId,
    type: entry.action === 'deduct' ? 'usage' : entry.action === 'add' ? 'bonus' : 'refund',
    amount: entry.amount,
    balance: entry.balanceAfter,
    description: entry.details.description || `Credit ${entry.action}`,
    creditsBefore: entry.balanceBefore,
    creditsAfter: entry.balanceAfter,
    metadata: entry.details,
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
  });
}

export async function getCreditHistory(
  userId: string,
  options: { startDate?: Date; endDate?: Date; type?: string; limit?: number }
): Promise<(typeof CreditTransaction)[]> {
  await connectDB();

  const query: Record<string, unknown> = { userId };

  if (options.startDate || options.endDate) {
    query.createdAt = {};
    if (options.startDate) (query.createdAt as Record<string, Date>).$gte = options.startDate;
    if (options.endDate) (query.createdAt as Record<string, Date>).$lte = options.endDate;
  }

  if (options.type) {
    query.type = options.type;
  }

  return CreditTransaction.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 100);
}

export async function searchAuditLogs(
  query: {
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  },
  options: { page?: number; limit?: number }
): Promise<{ logs: (typeof CreditTransaction)[]; total: number; pages: number }> {
  await connectDB();

  const dbQuery: Record<string, unknown> = {};

  if (query.userId) dbQuery.userId = query.userId;
  if (query.action) dbQuery.type = query.action;
  if (query.startDate || query.endDate) {
    dbQuery.createdAt = {};
    if (query.startDate) (dbQuery.createdAt as Record<string, Date>).$gte = query.startDate;
    if (query.endDate) (dbQuery.createdAt as Record<string, Date>).$lte = query.endDate;
  }

  const page = options.page || 1;
  const limit = options.limit || 20;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    CreditTransaction.find(dbQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
    CreditTransaction.countDocuments(dbQuery),
  ]);

  return {
    logs,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function exportAuditLogs(
  userId: string,
  format: 'json' | 'csv' = 'json'
): Promise<string> {
  const logs = await getCreditHistory(userId, { limit: 1000 });

  if (format === 'csv') {
    const headers = 'Date,Type,Amount,Balance,Description\n';
    const rows = logs
      .map(
        (log) =>
          `${log.createdAt.toISOString()},${log.type},${log.amount},${log.balance},"${log.description}"`
      )
      .join('\n');
    return headers + rows;
  }

  return JSON.stringify(logs, null, 2);
}