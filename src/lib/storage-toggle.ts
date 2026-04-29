import mongoose from 'mongoose';
import User from '@/models/User';
import StorageSettings from '@/models/StorageSettings';

export interface StorageToggleResult {
  success: boolean;
  storageType: 'local' | 'cloud';
  message?: string;
}

const MAX_STORAGE_FREE = 10 * 1024 * 1024;
const MAX_STORAGE_PRO = 1 * 1024 * 1024 * 1024;

export async function getStorageSettings(userId: string): Promise<{
  storageType: 'local' | 'cloud';
  isEnabled: boolean;
  storageUsed: number;
  maxStorage: number;
}> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  let settings = await StorageSettings.findOne({ userId });

  if (!settings) {
    const isPro = user.role === 'pro' || user.role === 'admin';
    const defaultStorage = isPro ? 'cloud' : 'local';

    settings = await StorageSettings.create({
      userId,
      storageType: defaultStorage,
      isEnabled: isPro,
    });
  }

  const maxStorage = (user.role === 'pro' || user.role === 'admin') 
    ? MAX_STORAGE_PRO 
    : MAX_STORAGE_FREE;

  return {
    storageType: settings.storageType,
    isEnabled: settings.isEnabled,
    storageUsed: settings.storageUsed || 0,
    maxStorage,
  };
}

export async function toggleStorage(
  userId: string,
  enable: boolean,
  migrateData: boolean = true
): Promise<StorageToggleResult> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isPro = user.role === 'pro' || user.role === 'admin';

  if (!isPro && enable) {
    const eligibleForCloud = user.credits >= 10;
    if (!eligibleForCloud) {
      return {
        success: false,
        storageType: 'local',
        message: 'Upgrade to Pro or earn 10 credits to enable cloud storage',
      };
    }
  }

  let settings = await StorageSettings.findOne({ userId });

  if (!settings) {
    settings = await StorageSettings.create({
      userId,
      storageType: enable ? 'cloud' : 'local',
      isEnabled: enable,
    });
  } else {
    if (enable) {
      settings.storageType = 'cloud';
      settings.isEnabled = true;
      if (migrateData) {
        settings.lastSyncAt = new Date();
      }
    } else {
      settings.storageType = 'local';
      settings.isEnabled = false;
    }
    await settings.save();
  }

  return {
    success: true,
    storageType: settings.storageType,
    message: enable 
      ? 'Cloud storage enabled. Your data is now stored in the cloud.' 
      : 'Storage switched to local. Data will be stored in your browser.',
  };
}

export async function updateStorageUsed(userId: string, bytes: number): Promise<void> {
  await StorageSettings.findOneAndUpdate(
    { userId },
    { storageUsed: bytes },
    { upsert: true }
  );
}