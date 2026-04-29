import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFile extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  storedFilename: string;
  mimeType: string;
  size: number;
  path: string;
  url?: string;
  bucket: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  documentId?: mongoose.Types.ObjectId;
  tool?: string;
  encryptionKey?: string;
  accessToken?: string;
  expiresAt?: Date;
  downloads: number;
  lastDownloaded?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
      maxlength: 500,
    },
    storedFilename: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    path: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    bucket: {
      type: String,
      default: 'local',
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed'],
      default: 'uploaded',
      index: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      index: true,
    },
    tool: {
      type: String,
    },
    encryptionKey: {
      type: String,
      select: false,
    },
    accessToken: {
      type: String,
      select: false,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastDownloaded: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ userId: 1, createdAt: -1 });

const FileModel: Model<IFile> =
  mongoose.models.File || mongoose.model<IFile>('File', fileSchema);

export default FileModel;