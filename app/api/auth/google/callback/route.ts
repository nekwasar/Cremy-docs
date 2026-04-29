import { NextRequest, NextResponse } from 'next/server';
import { initPassport } from '@/lib/passport';
import { jwtService } from '@/services/jwt';
import RefreshToken from '@/models/RefreshToken';
import User from '@/models/User';

initPassport();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/login?error=oauth_error', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userInfoResponse.json();

    let user = await User.findOne({ googleId: googleUser.id });

    if (!user) {
      user = await User.findOne({ email: googleUser.email?.toLowerCase() });

      if (user) {
        user.googleId = googleUser.id;
        if (!user.avatar && googleUser.picture) {
          user.avatar = googleUser.picture;
        }
        user.isEmailVerified = true;
        await user.save();
      } else {
        user = await User.create({
          email: googleUser.email?.toLowerCase(),
          name: googleUser.name,
          googleId: googleUser.id,
          avatar: googleUser.picture,
          isEmailVerified: true,
        });
      }
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const response = NextResponse.redirect(new URL('/', request.url));

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/login?error=oauth_error', request.url));
  }
}