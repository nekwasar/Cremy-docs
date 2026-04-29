import { getMongoDb } from '@/lib/mongodb';

interface UsageAnalytics {
  documentsToday: number;
  successRate: number;
  averageDuration: number;
  topTemplates: Array<{ templateId: string; count: number }>;
  totalCreditsUsed: number;
}

export async function getAnalytics(userId: string): Promise<UsageAnalytics> {
  const db = await getMongoDb();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayFilter = {
    userId,
    eventType: 'generation',
    timestamp: { $gte: today },
  };

  const allFilter = { userId, eventType: 'generation' };

  const todayGenerations = await db
    .collection('analytics_events')
    .countDocuments(todayFilter);

  const totalGenerations = await db
    .collection('analytics_events')
    .countDocuments(allFilter);

  const successCount = await db
    .collection('analytics_events')
    .countDocuments({ ...allFilter, success: true });

  const templates = await db
    .collection('analytics_events')
    .aggregate([
      { $match: { userId, eventType: 'generation' } },
      { $group: { _id: '$templateId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])
    .toArray();

  const durationData = await db
    .collection('analytics_events')
    .aggregate([
      { $match: { userId, eventType: 'generation', success: true } },
      { $group: { _id: null, avgDuration: { $avg: '$duration' } } },
    ])
    .toArray();

  const creditData = await db
    .collection('analytics_events')
    .aggregate([
      { $match: { userId, eventType: 'generation' } },
      { $group: { _id: null, total: { $sum: '$creditCost' } } },
    ])
    .toArray();

  return {
    documentsToday: todayGenerations,
    successRate: totalGenerations > 0 ? (successCount / totalGenerations) * 100 : 0,
    averageDuration: durationData[0]?.avgDuration || 0,
    topTemplates: templates.map((t: any) => ({
      templateId: t._id,
      count: t.count,
    })),
    totalCreditsUsed: creditData[0]?.total || 0,
  };
}

export async function getAdminAnalytics(): Promise<{
  totalDocuments: number;
  totalUsers: number;
  totalCreditsUsed: number;
  averageSuccessRate: number;
}> {
  const db = await getMongoDb();

  const totalDocuments = await db
    .collection('analytics_events')
    .countDocuments({ eventType: 'generation' });

  const userData = await db
    .collection('analytics_events')
    .aggregate([
      { $match: { eventType: 'generation' } },
      { $group: { _id: '$userId' } },
      { $count: 'count' },
    ])
    .toArray();

  const totalGenerations = await db
    .collection('analytics_events')
    .countDocuments({ eventType: 'generation' });

  const successCount = await db
    .collection('analytics_events')
    .countDocuments({ eventType: 'generation', success: true });

  const creditData = await db
    .collection('analytics_events')
    .aggregate([
      { $match: { eventType: 'generation' } },
      { $group: { _id: null, total: { $sum: '$creditCost' } } },
    ])
    .toArray();

  return {
    totalDocuments,
    totalUsers: userData[0]?.count || 0,
    totalCreditsUsed: creditData[0]?.total || 0,
    averageSuccessRate: totalGenerations > 0 ? (successCount / totalGenerations) * 100 : 0,
  };
}