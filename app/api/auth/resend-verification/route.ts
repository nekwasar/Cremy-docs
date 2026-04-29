import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { jwtService } from '@/services/jwt';

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resendSchema.parse(body);

    await connectDB();

    const user = await User.findOne({ email: validatedData.email.toLowerCase() });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a verification email will be sent',
      });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a verification email will be sent',
      });
    }

    const verificationToken = jwtService.generateEmailVerificationToken(
      user._id.toString(),
      user.email
    );

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}