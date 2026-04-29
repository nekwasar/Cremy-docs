import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITool extends Document {
  name: string;
  slug: string;
  description?: string;
  category: string;
  type: 'generate' | 'convert' | 'edit' | 'extract';
  credits: number;
  features?: string[];
  inputFormat?: string[];
  outputFormat?: string;
  isActive: boolean;
  isPro: boolean;
  usageCount: number;
  avgProcessingTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const toolSchema = new Schema<ITool>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
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
    type: {
      type: String,
      enum: ['generate', 'convert', 'edit', 'extract'],
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    features: [{
      type: String,
    }],
    inputFormat: [{
      type: String,
    }],
    outputFormat: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    avgProcessingTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

toolSchema.index({ category: 1, isActive: 1 });
toolSchema.index({ isPro: 1, isActive: 1 });

const Tool: Model<ITool> =
  mongoose.models.Tool || mongoose.model<ITool>('Tool', toolSchema);

export default Tool;