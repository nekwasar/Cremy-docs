function buildCSP(csp: Record<string, string[]>): string {
  return Object.entries(csp)
    .filter(([_, values]) => values.length > 0)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

function generateNonce(): string {
  return Buffer.from(crypto.randomUUID() + Date.now()).toString('base64');
}

function getAllowedOrigins(origin: string): string[] {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const defaultOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.APP_URL,
  ].filter(Boolean);

  return [...defaultOrigins, ...allowedOrigins];
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = getAllowedOrigins(origin);
  const isCorsOriginAllowed = allowedOrigins.includes(origin);

  const response = NextResponse.next();

  if (isCorsOriginAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');

  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

function generateNonce(): string {
  return Buffer.from(crypto.randomUUID() + Date.now()).toString('base64');
}

function getAllowedOrigins(origin: string): string[] {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const defaultOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.APP_URL,
  ].filter(Boolean);

  return [...defaultOrigins, ...allowedOrigins];
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = getAllowedOrigins(origin);
  const isCorsOriginAllowed = allowedOrigins.includes(origin);

  const response = NextResponse.next();

  if (isCorsOriginAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');

  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  const nonce = generateNonce();
  const cspWithNonce = {
    ...CSP_DIRECTIVES,
    'script-src': [...CSP_DIRECTIVES['script-src'], `'nonce-${nonce}'`],
  };

  response.headers.set('Content-Security-Policy', buildCSP(cspWithNonce, nonce));
  
  response.cookies.set('x-csrf-token', generateNonce(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  });

  return response;
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};