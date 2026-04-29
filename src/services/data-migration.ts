import { getMongoDb } from '@/lib/mongodb';

interface MigrationResult {
  success: boolean;
  documentsMigrated: number;
  settingsMigrated: boolean;
  error?: string;
}

export async function migrateLocalToMongo(
  userId: string,
  localData: {
    documents: any[];
    settings: any;
    drafts: any[];
  }
): Promise<MigrationResult> {
  try {
    const db = await getMongoDb();
    let documentsMigrated = 0;

    for (const doc of localData.documents) {
      await db.collection('documents').insertOne({
        ...doc,
        userId,
        migratedFromLocal: true,
        migratedAt: new Date(),
      });
      documentsMigrated++;
    }

    if (localData.settings) {
      await db.collection('user_settings').updateOne(
        { userId },
        { $set: { ...localData.settings, userId } },
        { upsert: true }
      );
    }

    for (const draft of localData.drafts) {
      await db.collection('documents').insertOne({
        ...draft,
        userId,
        status: 'draft',
        migratedFromLocal: true,
      });
    }

    return {
      success: true,
      documentsMigrated,
      settingsMigrated: true,
    };
  } catch (error) {
    return {
      success: false,
      documentsMigrated: 0,
      settingsMigrated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function migrateMongoToLocal(
  userId: string
): Promise<{
  documents: any[];
  settings: any;
  drafts: any[];
}> {
  const db = await getMongoDb();

  const documents = await db.collection('documents')
    .find({ userId, status: { $ne: 'draft' } })
    .limit(100)
    .toArray();

  const drafts = await db.collection('documents')
    .find({ userId, status: 'draft' })
    .toArray();

  const settings = await db.collection('user_settings').findOne({ userId });

  return {
    documents: documents.map(serializeDocument),
    settings: settings || {},
    drafts: drafts.map(serializeDocument),
  };
}

function serializeDocument(doc: any): any {
  return {
    id: doc._id?.toString(),
    title: doc.title,
    content: doc.content,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    status: doc.status,
  };
}