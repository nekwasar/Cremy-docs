import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICreditTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'purchase' | 'usage' | 'bonus' | 'refund' | 'admin' | 'referral';
  amount: number;
  balance: number;
  description?: string;
  referenceId?: mongoose.Types.ObjectId;
  referenceModel?: 'Document' | 'Subscription' | 'Payment';
  paymentId?: string;
  creditsBefore: number;
  creditsAfter: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const creditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['purchase', 'usage', 'bonus', 'refund', 'admin', 'referral'],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      refPath: 'referenceModel',
    },
    referenceModel: {
      type: String,
      enum: ['Document', 'Subscription', 'Payment'],
    },
    paymentId: {
      type: String,
    },
    creditsBefore: {
      type: Number,
      required: true,
      min: 0,
    },
    creditsAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

creditTransactionSchema.index({ userId: 1, createdAt: -1 });
creditTransactionSchema.index({ type: 1, createdAt: -1 });

const CreditTransaction: Model<ICreditTransaction> =
  mongoose.models.CreditTransaction ||
  mongoose.model<ICreditTransaction>('CreditTransaction', creditTransactionSchema);

export default CreditTransaction;