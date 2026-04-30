import { getMongoDb } from '@/lib/mongodb';

const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY_HOURS = 24;

export function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function saveAdminToken(token: string): Promise<{ token: string; expiresAt: Date }> {
  const db = await getMongoDb();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await db.collection('admin_tokens').insertOne({
    token,
    createdAt: new Date(),
    expiresAt,
    usedAt: null,
    usedBy: null,
  });

  return { token, expiresAt };
}

export async function validateAdminToken(token: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  const db = await getMongoDb();
  const record = await db.collection('admin_tokens').findOne({ token });

  if (!record) {
    return { valid: false, error: 'Invalid token. Token not found.' };
  }

  if (record.usedAt) {
    return { valid: false, error: 'Token already used.' };
  }

  if (new Date(record.expiresAt) < new Date()) {
    return { valid: false, error: 'Token expired. Run admin:create again.' };
  }

  return { valid: true };
}

export async function markTokenAsUsed(token: string, userId: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection('admin_tokens').updateOne(
    { token },
    { $set: { usedAt: new Date(), usedBy: userId } }
  );
}

export async function cleanupExpiredTokens(): Promise<number> {
  const db = await getMongoDb();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const result = await db.collection('admin_tokens').deleteMany({
    createdAt: { $lt: sevenDaysAgo },
  });
  return result.deletedCount;
}
