import { getMongoDb } from '@/lib/mongodb';

interface ConvertHistoryEntry {
  userId: string;
  sourceFormat: string;
  targetFormat: string;
  fileName: string;
  fileSize: number;
  success: boolean;
  qualityScore?: number;
  usedFallback: boolean;
  timestamp: Date;
}

export async function logConversion(entry: ConvertHistoryEntry): Promise<void> {
  try {
    const db = await getMongoDb();
    await db.collection('conversion_history').insertOne(entry);
  } catch {}
}

export async function getUserConversions(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ entries: ConvertHistoryEntry[]; total: number }> {
  const db = await getMongoDb();
  const skip = (page - 1) * limit;

  const [entries, total] = await Promise.all([
    db.collection('conversion_history')
      .find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('conversion_history').countDocuments({ userId }),
  ]);

  return { entries: entries as ConvertHistoryEntry[], total };
}
