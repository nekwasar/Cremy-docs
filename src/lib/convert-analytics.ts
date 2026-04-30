import { getMongoDb } from '@/lib/mongodb';

export async function logConvertAnalytics(data: {
  sourceFormat: string;
  targetFormat: string;
  success: boolean;
  fileSize: number;
  duration: number;
}): Promise<void> {
  try {
    const db = await getMongoDb();
    await db.collection('conversion_analytics').insertOne({
      ...data,
      timestamp: new Date(),
    });
  } catch {}
}

export async function getConversionStats(): Promise<{
  total: number;
  byFormat: Record<string, number>;
  successRate: number;
}> {
  try {
    const db = await getMongoDb();
    
    const total = await db.collection('conversion_analytics').countDocuments();
    const success = await db.collection('conversion_analytics').countDocuments({ success: true });

    const formatData = await db.collection('conversion_analytics')
      .aggregate([
        { $group: { _id: '$targetFormat', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray();

    const byFormat: Record<string, number> = {};
    formatData.forEach((d: any) => { byFormat[d._id] = d.count; });

    return {
      total,
      byFormat,
      successRate: total > 0 ? Math.round((success / total) * 100) : 0,
    };
  } catch {
    return { total: 0, byFormat: {}, successRate: 0 };
  }
}
