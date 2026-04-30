import { getMongoDb } from '@/lib/mongodb';

interface GenerationHistoryEntry {
  userId: string;
  timestamp: Date;
  type: 'generate' | 'edit' | 'format' | 'translate' | 'summarize' | 'regenerate';
  documentId?: string;
  wordCount: number;
  creditCost: number;
  success: boolean;
  error?: string;
}

export async function logGenerationEntry(entry: GenerationHistoryEntry): Promise<void> {
  try {
    const db = await getMongoDb();
    await db.collection('generation_history').insertOne(entry);
  } catch (error) {
    console.error('Failed to log generation history:', error);
  }
}

export async function getUserHistory(
  userId: string,
  options: {
    page?: number;
    limit?: number;
    type?: string;
    success?: boolean;
  } = {}
): Promise<{ entries: GenerationHistoryEntry[]; total: number }> {
  const db = await getMongoDb();
  const { page = 1, limit = 20, type, success } = options;

  const filter: Record<string, unknown> = { userId };
  if (type) filter.type = type;
  if (success !== undefined) filter.success = success;

  const skip = (page - 1) * limit;

  const [entries, total] = await Promise.all([
    db.collection('generation_history')
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('generation_history').countDocuments(filter),
  ]);

  return { entries: entries as GenerationHistoryEntry[], total };
}

export async function getGenerationStats(userId: string): Promise<{
  totalGenerations: number;
  totalCreditsUsed: number;
  successRate: number;
  mostUsedType: string;
}> {
  const db = await getMongoDb();

  const [total, successCount, creditAgg, typeAgg] = await Promise.all([
    db.collection('generation_history').countDocuments({ userId }),
    db.collection('generation_history').countDocuments({ userId, success: true }),
    db.collection('generation_history').aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$creditCost' } } },
    ]).toArray(),
    db.collection('generation_history').aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]).toArray(),
  ]);

  return {
    totalGenerations: total,
    totalCreditsUsed: (creditAgg[0] as any)?.total || 0,
    successRate: total > 0 ? Math.round((successCount / total) * 100) : 0,
    mostUsedType: typeAgg[0]?._id || 'generate',
  };
}