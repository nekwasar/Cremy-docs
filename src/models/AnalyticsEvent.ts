import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  eventType: string;
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  properties?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  createdAt: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    properties: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
    country: {
      type: String,
    },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ userId: 1, createdAt: -1 });

const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);

export default AnalyticsEvent;