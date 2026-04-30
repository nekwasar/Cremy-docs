import { getMongoDb } from '@/lib/mongodb';

export async function getUserDocuments(
  userId: string,
  options: {
    page?: number;
    limit?: number;
    sort?: string;
    format?: string;
    search?: string;
    folderId?: string;
  } = {}
): Promise<{ documents: any[]; total: number }> {
  const db = await getMongoDb();
  const { page = 1, limit = 50, sort = 'newest', format, search, folderId } = options;

  const filter: Record<string, unknown> = { userId, status: { $ne: 'deleted' } };

  if (format) filter.format = format;
  if (folderId !== undefined) {
    filter.folderId = folderId || { $exists: false };
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const sortMap: Record<string, Record<string, number>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name: { title: 1 },
    format: { format: 1 },
  };

  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    db.collection('documents').find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(limit).toArray(),
    db.collection('documents').countDocuments(filter),
  ]);

  return { documents, total };
}

export async function deleteDocumentPermanently(documentId: string, userId: string): Promise<boolean> {
  const db = await getMongoDb();
  const result = await db.collection('documents').deleteOne({ _id: documentId, userId });
  return result.deletedCount > 0;
}

export async function bulkDeleteDocuments(documentIds: string[], userId: string): Promise<number> {
  const db = await getMongoDb();
  const result = await db.collection('documents').deleteMany({
    _id: { $in: documentIds },
    userId,
  });
  return result.deletedCount;
}

export async function getDocumentCounts(userId: string): Promise<{
  total: number;
  thisMonth: number;
  byFormat: Record<string, number>;
}> {
  const db = await getMongoDb();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, thisMonth, formatAgg] = await Promise.all([
    db.collection('documents').countDocuments({ userId, status: { $ne: 'deleted' } }),
    db.collection('documents').countDocuments({ userId, status: { $ne: 'deleted' }, createdAt: { $gte: monthStart } }),
    db.collection('documents').aggregate([
      { $match: { userId } },
      { $group: { _id: '$format', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]).toArray(),
  ]);

  const byFormat: Record<string, number> = {};
  formatAgg.forEach((d: any) => { byFormat[d._id] = d.count; });

  return { total, thisMonth, byFormat };
}
