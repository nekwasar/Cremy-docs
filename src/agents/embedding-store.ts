interface EmbeddingRecord {
  sessionId: string;
  message: string;
  vector: number[];
  timestamp: Date;
}

export async function storeEmbedding(
  sessionId: string,
  message: string,
  vector?: number[]
): Promise<void> {
  if (!vector) {
    vector = Array.from({ length: 32 }, () => Math.random());
  }

  try {
    const db = await (await import('@/lib/mongodb')).getMongoDb();
    await db.collection('embeddings').insertOne({
      sessionId,
      message,
      vector,
      timestamp: new Date(),
    });
  } catch {}
}

export async function getSessionEmbeddings(
  sessionId: string,
  limit: number = 10
): Promise<number[][]> {
  try {
    const db = await (await import('@/lib/mongodb')).getMongoDb();
    const records = await db.collection('embeddings')
      .find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return records.map((r: any) => r.vector || []);
  } catch {
    return [];
  }
}

export async function cleanupOldEmbeddings(maxAgeDays: number = 30): Promise<number> {
  try {
    const db = await (await import('@/lib/mongodb')).getMongoDb();
    const result = await db.collection('embeddings').deleteMany({
      timestamp: { $lt: new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000) },
    });
    return result.deletedCount;
  } catch {
    return 0;
  }
}
