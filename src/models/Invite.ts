import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInvite extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  role: 'member' | 'admin';
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: mongoose.Types.ObjectId;
  acceptedBy?: mongoose.Types.ObjectId;
  acceptedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired'],
      default: 'pending',
      index: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    acceptedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    acceptedAt: {
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

inviteSchema.index({ email: 1, status: 1 });

const Invite: Model<IInvite> =
  mongoose.models.Invite || mongoose.model<IInvite>('Invite', inviteSchema);

export default Invite;