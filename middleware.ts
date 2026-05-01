import { NextRequest, NextResponse } from 'next/server';

const CSP_DIRECTIVES: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'", 'ws:', 'wss:'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
};

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
};

function buildCSP(csp: Record<string, string[]>): string {
  return Object.entries(csp)
    .filter(([, values]) => values.length > 0)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

function generateNonce(): string {
  return crypto.randomUUID();
}

function getAllowedOrigins(): string[] {
  const allowed = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const defaults = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.NEXT_PUBLIC_APP_URL || '',
  ].filter(Boolean);
  return [...defaults, ...allowed];
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = getAllowedOrigins();
  const isCorsOriginAllowed = allowedOrigins.includes(origin);

  const response = NextResponse.next();

  if (isCorsOriginAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store');
  }

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  const isDev = process.env.NODE_ENV === 'development';

  const nonce = generateNonce();
  const cspWithNonce = {
    ...CSP_DIRECTIVES,
    'script-src': [
      ...(CSP_DIRECTIVES['script-src'] || []),
      ...(isDev ? ["'unsafe-eval'"] : []),
      `'nonce-${nonce}'`,
    ],
  };

  response.headers.set('Content-Security-Policy', buildCSP(cspWithNonce));

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
