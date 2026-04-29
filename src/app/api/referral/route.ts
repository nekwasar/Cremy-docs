import { NextRequest, NextResponse } from 'next/server';
import { generateReferralCode, getUserReferralCode, getReferralStats, getReferralHistory } from '@/lib/referral';
import { withAuth, AuthUser } from '@/lib/auth';

async function generateCodeHandler(request: NextRequest, user: AuthUser) {
  try {
    const code = await generateReferralCode(user.sub);

    return NextResponse.json({
      success: true,
      data: { code },
    });
  } catch (error) {
    console.error('Generate code error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

async function statsHandler(request: NextRequest, user: AuthUser) {
  try {
    const stats = await getReferralStats(user.sub);
    const history = await getReferralHistory(user.sub);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        history: history.map((h) => ({
          refereeId: h.refereeId,
          status: h.status,
          createdAt: h.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

async function getCodeHandler(request: NextRequest, user: AuthUser) {
  try {
    const code = await getUserReferralCode(user.sub);

    if (!code) {
      return NextResponse.json({
        success: true,
        data: { code: null },
      });
    }

    return NextResponse.json({
      success: true,
      data: { code },
    });
  } catch (error) {
    console.error('Get code error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  
  if (pathname.includes('/stats')) {
    return statsHandler(request, await getCurrentUser(request));
  }
  
  return getCodeHandler(request, await getCurrentUser(request));
};

async function getCurrentUser(request: NextRequest): Promise<AuthUser> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.substring(7);
  const { verifyAccessToken } = await import('@/lib/token-rotation');
  
  return verifyAccessToken(token) as unknown as AuthUser;
}

export const POST = generateCodeHandler;