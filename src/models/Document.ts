import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content?: string;
  type: 'generated' | 'uploaded' | 'template';
  status: 'draft' | 'processing' | 'completed' | 'failed';
  format: 'pdf' | 'docx' | 'txt' | 'md';
  tools?: string[];
  inputData?: Record<string, any>;
  outputData?: Record<string, any>;
  sourceDocumentId?: mongoose.Types.ObjectId;
  isPublic: boolean;
  shareToken?: string;
  wordCount?: number;
  pageCount?: number;
  processingTime?: number;
  creditsUsed: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
    },
    type: {
      type: String,
      enum: ['generated', 'uploaded', 'template'],
      default: 'generated',
    },
    status: {
      type: String,
      enum: ['draft', 'processing', 'completed', 'failed'],
      default: 'draft',
      index: true,
    },
    format: {
      type: String,
      enum: ['pdf', 'docx', 'txt', 'md'],
      default: 'md',
    },
    tools: [{
      type: String,
    }],
    inputData: {
      type: Schema.Types.Mixed,
    },
    outputData: {
      type: Schema.Types.Mixed,
    },
    sourceDocumentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    pageCount: {
      type: Number,
    },
    processingTime: {
      type: Number,
    },
    creditsUsed: {
      type: Number,
      default: 0,
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

documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ userId: 1, status: 1 });
documentSchema.index({ isPublic: 1, createdAt: -1 });
documentSchema.index({ shareToken: 1 });

const DocumentModel: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema);

export default DocumentModel;