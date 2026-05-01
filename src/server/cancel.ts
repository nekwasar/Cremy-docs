import { getMongoDb } from '@/lib/mongodb';
import { cancelGeneration } from '@/server/generate-handler';

interface CancelResult {
  cancelled: boolean;
  creditRefunded: boolean;
  error?: string;
}

export async function cancelUserGeneration(userId: string): Promise<CancelResult> {
  try {
    const wasCancelled = cancelGeneration(userId);
    
    if (!wasCancelled) {
      return { cancelled: false, creditRefunded: false, error: 'No active generation' };
    }

    const db = await getMongoDb();
    
    const user = await db.collection('users').findOne({ _id: userId as any });
    if (user) {
      await db.collection('users').updateOne(
        { _id: userId as any },
        { $inc: { credits: 1 } }
      );

      await db.collection('credit_transactions').insertOne({
        userId,
        amount: 1,
        type: 'refund',
        reason: 'generation_cancelled',
        timestamp: new Date(),
      });
    }

    return { cancelled: true, creditRefunded: true };
  } catch (error) {
    return {
      cancelled: false,
      creditRefunded: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}