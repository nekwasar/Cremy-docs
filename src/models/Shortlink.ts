import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IShortlink extends Document {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  slug: string;
  fullUrl: string;
  visits: number;
  lastVisited?: Date;
  expiresAt?: Date;
  password?: string;
  isActive: boolean;
  createdAt: Date;
}

const shortlinkSchema = new Schema<IShortlink>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullUrl: {
      type: String,
      required: true,
    },
    visits: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastVisited: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    password: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

shortlinkSchema.index({ userId: 1, createdAt: -1 });

const Shortlink: Model<IShortlink> =
  mongoose.models.Shortlink || mongoose.model<IShortlink>('Shortlink', shortlinkSchema);

export default Shortlink;