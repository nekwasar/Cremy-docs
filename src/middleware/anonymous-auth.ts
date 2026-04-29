import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function getAnonymousId(request: NextRequest): string | null {
  const anonId = request.cookies.get('anon_id')?.value;
  return anonId || null;
}

export function createAnonymousSession(response: NextResponse): string {
  const anonId = uuidv4();
  
  response.cookies.set('anon_id', anonId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return anonId;
}

export function validateAnonymousSession(request: NextRequest): boolean {
  const anonId = getAnonymousId(request);
  return !!anonId;
}