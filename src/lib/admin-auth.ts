import { getMongoDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { validatePasswordComplexity } from './password-complexity';
import { validateAdminToken, markTokenAsUsed } from './admin-tokens';

export async function createAdminFromToken(
  token: string,
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const tokenValidation = await validateAdminToken(token);
  if (!tokenValidation.valid) {
    return { success: false, error: tokenValidation.error };
  }

  const passwordValidation = validatePasswordComplexity(password);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.errors.join('. ') };
  }

  const db = await getMongoDb();

  const existingAdmin = await db.collection('users').findOne({ role: 'admin' });
  if (existingAdmin) {
    await db.collection('users').updateOne(
      { _id: existingAdmin._id },
      { $set: { role: 'user' } }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await db.collection('users').insertOne({
    username,
    passwordHash,
    role: 'admin',
    credits: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await markTokenAsUsed(token, result.insertedId.toString());

  return { success: true };
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  const db = await getMongoDb();
  const user = await db.collection('users').findOne({ username, role: 'admin' });

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: 'Invalid credentials' };
  }

  return {
    success: true,
    user: {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    },
  };
}

export async function getCurrentAdmin(): Promise<any | null> {
  const db = await getMongoDb();
  return db.collection('users').findOne({ role: 'admin' });
}
