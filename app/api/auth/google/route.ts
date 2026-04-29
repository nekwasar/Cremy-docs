import { NextResponse } from 'next/server';
import { initPassport } from '@/lib/passport';
import { jwtService } from '@/services/jwt';
import RefreshToken from '@/models/RefreshToken';

initPassport();

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

  if (!clientId) {
    return NextResponse.json(
      { error: { message: 'Google OAuth not configured', code: 'OAUTH_NOT_CONFIGURED' } },
      { status: 500 }
    );
  }

  const scope = ['profile', 'email'].join(' ');
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', Math.random().toString(36).substring(7));

  return NextResponse.redirect(authUrl.toString());
}