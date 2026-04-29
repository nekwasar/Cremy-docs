import { getMongoDb } from '@/lib/mongodb';

interface GenerationHistory {
  userId: string;
  documentId?: string;
  type: 'generate' | 'edit' | 'format' | 'translate' | 'summarize';
  success: boolean;
  duration: number;
  wordCount?: number;
  creditCost?: number;
  error?: string;
  timestamp: Date;
}

export async function logGenerationHistory(history: GenerationHistory): Promise<void> {
  try {
    const db = await getMongoDb();
    
    await db.collection('analytics_events').insertOne({
      ...history,
      eventType: 'generation',
      timestamp: history.timestamp,
    });
  } catch (error) {
    console.error('Failed to log generation history:', error);
  }
}

export async function getUserGenerationHistory(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ history: GenerationHistory[]; total: number }> {
  const db = await getMongoDb();
  
  const skip = (page - 1) * limit;
  
  const [history, total] = await Promise.all([
    db.collection('analytics_events')
      .find({ userId, eventType: 'generation' })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('analytics_events')
      .countDocuments({ userId, eventType: 'generation' }),
  ]);

  return { history: history as GenerationHistory[], total };
}