import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  key: string;
  prefix: string;
  permissions: ('read' | 'write')[];
  rateLimit: number;
  lastUsed?: Date;
  lastUsedIp?: string;
  expiresAt?: Date;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const apiKeySchema = new Schema<IApiKey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    prefix: {
      type: String,
      required: true,
      maxlength: 8,
    },
    permissions: [{
      type: String,
      enum: ['read', 'write'],
    }],
    rateLimit: {
      type: Number,
      default: 60,
      min: 1,
    },
    lastUsed: {
      type: Date,
    },
    lastUsedIp: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

apiKeySchema.index({ userId: 1, isActive: 1 });

const ApiKey: Model<IApiKey> =
  mongoose.models.ApiKey || mongoose.model<IApiKey>('ApiKey', apiKeySchema);

export default ApiKey;