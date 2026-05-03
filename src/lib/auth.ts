import { NextRequest, NextResponse } from 'next/server';
import { jwtService, TokenPayload } from '@/services/jwt';

export interface AuthUser {
  sub: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export const authOptions = {
  providers: [],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: 'jwt' as const,
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
};

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    return jwtService.verifyAccessToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export function withAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<Response>
) {
  return async (request: NextRequest) => {
    try {
      const user = await requireAuth(request);
      return handler(request, user);
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        return NextResponse.json(
          { error: { message: 'Authentication required', code: 'UNAUTHORIZED' } },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
        { status: 500 }
      );
    }
  };
}