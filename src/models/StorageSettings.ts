import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStorageSettings extends Document {
  userId: mongoose.Types.ObjectId;
  storageType: 'local' | 'cloud';
  isEnabled: boolean;
  storageUsed?: number;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const storageSettingsSchema = new Schema<IStorageSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    storageType: {
      type: String,
      enum: ['local', 'cloud'],
      default: 'local',
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    storageUsed: {
      type: Number,
      default: 0,
    },
    lastSyncAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const StorageSettings: Model<IStorageSettings> =
  mongoose.models.StorageSettings ||
  mongoose.model<IStorageSettings>('StorageSettings', storageSettingsSchema);

export default StorageSettings;