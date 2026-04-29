import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITemplate extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category: string;
  content: string;
  variables?: string[];
  format: 'pdf' | 'docx' | 'txt' | 'md';
  isGlobal: boolean;
  isPremium: boolean;
  usageCount: number;
  rating: number;
  ratingCount: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    variables: [{
      type: String,
    }],
    format: {
      type: String,
      enum: ['pdf', 'docx', 'txt', 'md'],
      default: 'md',
    },
    isGlobal: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

templateSchema.index({ category: 1, isGlobal: 1 });
templateSchema.index({ userId: 1, createdAt: -1 });
templateSchema.index({ isGlobal: 1, isPremium: 1, category: 1 });

const Template: Model<ITemplate> =
  mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);

export default Template;