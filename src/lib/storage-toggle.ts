import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Document from '@/models/Document';

interface StoragePreference {
  userId: string;
  useMongoDB: boolean;
  enabledAt: Date;
}

export async function getStoragePreference(userId: string): Promise<boolean> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) return false;

  const subscription = user.subscription;
  if (subscription === 'pro') return true;

  const settings = await User.findById(userId).select('useMongoDB') as any;
  return settings?.useMongoDB ?? false;
}

export async function setStoragePreference(
  userId: string,
  useMongoDB: boolean
): Promise<boolean> {
  const user = await User.findById(userId) as any;
  if (!user) return false;

  const isPro = user.subscription === 'pro';
  const credits = user.credits || 0;

  if (useMongoDB && !isPro && credits < 10) {
    return false;
  }

  await User.findByIdAndUpdate(userId, {
    useMongoDB,
    storageEnabledAt: useMongoDB ? new Date() : null,
  });

  return true;
}

export async function migrateLocalToMongo(
  userId: string,
  localDocuments: { title: string; content: string; type: string }[]
): Promise<number> {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) return 0;

  let migrated = 0;

  for (const doc of localDocuments) {
    await Document.create({
      userId,
      title: doc.title,
      content: doc.content,
      type: doc.type as 'generated' | 'uploaded' | 'template',
      status: 'completed',
      format: 'txt',
      storage: 'mongodb',
    });

    migrated++;
  }

  await User.findByIdAndUpdate(userId, { useMongoDB: true });

  return migrated;
}

export async function migrateMongoToLocal(userId: string): Promise<{ title: string; content: string }[]> {
  await connectDB();

  await User.findByIdAndUpdate(userId, { useMongoDB: false });

  const documents = await Document.find({ userId, storage: 'mongodb' }).select(
    'title content'
  );

  return documents.map((d) => ({
    title: d.title,
      content: d.content || '',
  }));
}

export async function getStorageStats(
  userId: string
): Promise<{ totalDocuments: number; storageUsed: number; storageType: string }> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user) return { totalDocuments: 0, storageUsed: 0, storageType: 'localStorage' };

  const useMongoDB = user.useMongoDB ?? false;
  const storageType = useMongoDB ? 'mongodb' : 'localStorage';

  if (!useMongoDB) {
    return { totalDocuments: 0, storageUsed: 0, storageType };
  }

  const documents = await Document.countDocuments({ userId });
  const totalSize = await Document.aggregate([
    { $match: { userId } },
    {
      $project: {
        contentSize: { $strLenCP: '$content' },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$contentSize' },
      },
    },
  ]);

  return {
    totalDocuments: documents,
    storageUsed: totalSize[0]?.total || 0,
    storageType,
  };
}

export async function deleteOldLocalStorageData(userId: string): Promise<void> {
  await connectDB();

  const user = await User.findById(userId) as any;
  if (!user?.useMongoDB) return;

  await User.findByIdAndUpdate(userId, { useMongoDB: false });
}