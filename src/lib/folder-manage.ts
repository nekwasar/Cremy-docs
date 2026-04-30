import { getMongoDb } from '@/lib/mongodb';

interface FolderData {
  id: string;
  name: string;
  documentCount: number;
  createdAt: string;
}

export async function createFolder(userId: string, name: string): Promise<FolderData | null> {
  try {
    const db = await getMongoDb();
    const result = await db.collection('folders').insertOne({
      userId,
      name,
      documentCount: 0,
      createdAt: new Date(),
    });

    return {
      id: result.insertedId.toString(),
      name,
      documentCount: 0,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getUserFolders(userId: string): Promise<FolderData[]> {
  const db = await getMongoDb();
  const folders = await db.collection('folders').find({ userId }).sort({ name: 1 }).toArray();

  const folderIds = folders.map((f: any) => f._id.toString());
  const docCounts = await db.collection('documents').aggregate([
    { $match: { userId, folderId: { $in: folderIds } } },
    { $group: { _id: '$folderId', count: { $sum: 1 } } },
  ]).toArray();

  const countMap: Record<string, number> = {};
  docCounts.forEach((d: any) => { countMap[d._id] = d.count; });

  return folders.map((f: any) => ({
    id: f._id.toString(),
    name: f.name,
    documentCount: countMap[f._id.toString()] || 0,
    createdAt: f.createdAt?.toISOString() || '',
  }));
}

export async function deleteFolder(folderId: string, userId: string): Promise<boolean> {
  const db = await getMongoDb();
  await db.collection('folders').deleteOne({ _id: folderId, userId });
  await db.collection('documents').updateMany(
    { userId, folderId },
    { $unset: { folderId: '' } }
  );
  return true;
}

export async function moveToFolder(documentId: string, folderId: string | null, userId: string): Promise<boolean> {
  const db = await getMongoDb();
  const update = folderId ? { $set: { folderId } } : { $unset: { folderId: '' } };
  const result = await db.collection('documents').updateOne({ _id: documentId, userId }, update);
  return result.modifiedCount > 0;
}
