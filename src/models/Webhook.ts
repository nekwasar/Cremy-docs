import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWebhook extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  lastTriggered?: Date;
  failureCount: number;
  lastError?: string;
  headers?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const webhookSchema = new Schema<IWebhook>(
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
    url: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
      select: false,
    },
    events: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastTriggered: {
      type: Date,
    },
    failureCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastError: {
      type: String,
    },
    headers: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

webhookSchema.index({ userId: 1, isActive: 1 });

const Webhook: Model<IWebhook> =
  mongoose.models.Webhook || mongoose.model<IWebhook>('Webhook', webhookSchema);

export default Webhook;