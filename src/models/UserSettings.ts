import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  defaultFormat: 'pdf' | 'docx' | 'txt' | 'md';
  defaultLanguage: string;
  notifications?: Record<string, any>;
  privacy?: Record<string, any>;
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  language: string;
  savedTools?: string[];
  recentSearches?: string[];
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    defaultFormat: {
      type: String,
      enum: ['pdf', 'docx', 'txt', 'md'],
      default: 'pdf',
    },
    defaultLanguage: {
      type: String,
      default: 'en',
    },
    notifications: {
      type: Schema.Types.Mixed,
    },
    privacy: {
      type: Schema.Types.Mixed,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    language: {
      type: String,
      default: 'en',
    },
    savedTools: [{
      type: String,
    }],
    recentSearches: [{
      type: String,
    }],
    preferences: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const UserSettings: Model<IUserSettings> =
  mongoose.models.UserSettings ||
  mongoose.model<IUserSettings>('UserSettings', userSettingsSchema);

export default UserSettings;