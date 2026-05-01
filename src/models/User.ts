import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: 'free' | 'pro' | 'admin';
  isEmailVerified: boolean;
  receivedSignupReward?: boolean;
  proCredits?: number;
  proCreditsExpires?: Date;
  referralCode?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  googleId?: string;
  credits: number;
  usedCredits: number;
  lastCreditResetAt?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJWTPayload(): object;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['free', 'pro', 'admin'],
      default: 'free',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    credits: {
      type: Number,
      default: 0,
      min: 0,
    },
    usedCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastCreditResetAt: {
      type: Date,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    receivedSignupReward: {
      type: Boolean,
      default: false,
    },
    proCredits: {
      type: Number,
      default: 0,
    },
    proCreditsExpires: {
      type: Date,
    },
    useMongoDB: {
      type: Boolean,
      default: false,
    },
    storageEnabledAt: {
      type: Date,
    },
    referredBy: {
      type: String,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  (this as any).password = await bcrypt.hash((this as any).password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJWTPayload = function () {
  return {
    sub: this._id,
    email: this.email,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
  };
};

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;