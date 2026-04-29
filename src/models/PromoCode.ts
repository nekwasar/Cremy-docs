import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  type: 'percentage' | 'fixed' | 'package';
  discount: number;
  creditAmount?: number;
  maxUses: number;
  usedCount: number;
  minPurchase?: number;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'package'],
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    creditAmount: {
      type: Number,
    },
    maxUses: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    minPurchase: {
      type: Number,
      min: 0,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

promoCodeSchema.index({ code: 1, isActive: 1 });

const PromoCode: Model<IPromoCode> =
  mongoose.models.PromoCode || mongoose.model<IPromoCode>('PromoCode', promoCodeSchema);

export default PromoCode;