import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  type: 'subscription' | 'credit_purchase' | 'one_time';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway: 'stripe' | 'paypal';
  gatewayPaymentId?: string;
  gatewayCustomerId?: string;
  description?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  refundedAt?: Date;
  refundAmount?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    type: {
      type: String,
      enum: ['subscription', 'credit_purchase', 'one_time'],
      required: true,
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
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    gateway: {
      type: String,
      enum: ['stripe', 'paypal'],
      required: true,
    },
    gatewayPaymentId: {
      type: String,
    },
    gatewayCustomerId: {
      type: String,
    },
    description: {
      type: String,
    },
    invoiceUrl: {
      type: String,
    },
    receiptUrl: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ userId: 1, createdAt: -1 });

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;