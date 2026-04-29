import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled';
  priority: 'low' | 'normal' | 'high';
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  attempts: number;
  maxAttempts: number;
  startedAt?: Date;
  completedAt?: Date;
  processingTime?: number;
  workerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'canceled'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    input: {
      type: Schema.Types.Mixed,
    },
    output: {
      type: Schema.Types.Mixed,
    },
    error: {
      type: String,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
      min: 1,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    processingTime: {
      type: Number,
    },
    workerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ userId: 1, status: 1 });
jobSchema.index({ status: 1, createdAt: 1 });

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);

export default Job;