import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'expired';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  paymentMethod?: string;
  paymentId?: string;
  amount: number;
  currency: string;
  features?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'expired'],
      default: 'trialing',
      index: true,
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
      index: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    features: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;