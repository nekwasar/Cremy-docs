import mongoose, { Document, Model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICreditGift extends Document {
  code: string;
  senderId?: mongoose.Types.ObjectId;
  senderEmail?: string;
  recipientEmail?: string;
  amount: number;
  message?: string;
  isRedeemed: boolean;
  redeemedBy?: mongoose.Types.ObjectId;
  redeemedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

const creditGiftSchema = new Schema<ICreditGift>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase(),
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    senderEmail: {
      type: String,
    },
    recipientEmail: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    isRedeemed: {
      type: Boolean,
      default: false,
    },
    redeemedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    redeemedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

creditGiftSchema.index({ code: 1 });
creditGiftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const CreditGift: Model<ICreditGift> =
  mongoose.models.CreditGift || mongoose.model<ICreditGift>('CreditGift', creditGiftSchema);

export default CreditGift;