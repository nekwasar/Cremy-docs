import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'bug' | 'feature' | 'general';
  subject: string;
  description: string;
  rating?: number;
  documentId?: mongoose.Types.ObjectId;
  tool?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  adminNotes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['bug', 'feature', 'general'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
    tool: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
      index: true,
    },
    adminNotes: {
      type: String,
      maxlength: 2000,
    },
    attachments: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, createdAt: -1 });

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;