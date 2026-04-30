import { getMongoDb } from '@/lib/mongodb';
import { generateToken, saveAdminToken } from '@/lib/admin-tokens';

async function createAdminToken(): Promise<void> {
  const db = await getMongoDb();
  const existingAdmin = await db.collection('users').findOne({ role: 'admin' });

  if (existingAdmin) {
    console.warn('WARNING: An admin account already exists. Creating a new admin will remove the old admin.');
  }

  const { token, expiresAt } = await saveAdminToken(generateToken());
  const link = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/create?token=${token}`;

  console.log('\n========== ADMIN INVITE ==========');
  console.log(`Link: ${link}`);
  console.log(`Token: ${token}`);
  console.log(`Expires: ${expiresAt.toISOString()}`);
  console.log('===================================\n');
}

createAdminToken().catch(console.error);
