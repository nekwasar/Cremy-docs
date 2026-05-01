import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function checkCreditsMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const url = new URL(request.url);
  
  const publicPaths = ['/', '/auth', '/templates', '/pro', '/api/auth'];
  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    return null;
  }

  const session = request.cookies.get('session')?.value;
  const anonId = request.cookies.get('anon_id')?.value;

  if (!session && !anonId) {
    return null;
  }

  const userId = session || anonId;

  try {
    const db = await getMongoDb();
    
    const user = await db.collection('users').findOne({ _id: userId as any });
    
    if (user && user.credits <= 0 && url.pathname.startsWith('/generate')) {
      return NextResponse.redirect(new URL('/credits?reason=exhausted', request.url));
    }

    return null;
  } catch {
    return null;
  }
}