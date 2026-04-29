import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { jwtService } from '@/services/jwt';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    await connectDB();

    const decoded = jwtService.verifyPasswordResetToken(validatedData.token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Invalid token', code: 'INVALID_TOKEN' } },
        { status: 400 }
      );
    }

    if (
      user.passwordResetToken !== validatedData.token ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      return NextResponse.json(
        { error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' } },
        { status: 400 }
      );
    }

    user.password = validatedData.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await RefreshToken.updateMany(
      { userId: user._id, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' } },
      { status: 400 }
    );
  }
}