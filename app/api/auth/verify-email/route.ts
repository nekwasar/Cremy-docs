import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { jwtService } from '@/services/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: { message: 'Verification token is required', code: 'MISSING_TOKEN' } },
        { status: 400 }
      );
    }

    await connectDB();

    const decoded = jwtService.verifyEmailVerificationToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Invalid token', code: 'INVALID_TOKEN' } },
        { status: 400 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email already verified',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' } },
      { status: 400 }
    );
  }
}