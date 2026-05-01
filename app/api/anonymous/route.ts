import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Document from '@/models/Document';
import { getStoragePreference, setStoragePreference, migrateLocalToMongo } from '@/lib/storage-toggle';
import { getAnonymousUser, migrateAnonymousToRegistered, deleteAnonymousUser, createAnonymousUser, getAnonymousCredits, deductAnonymousCredits, addAnonymousCredits, addAnonymousDocument, getAnonymousDocuments, deleteAnonymousDocument } from '@/lib/anonymous-user';

const anonymousUserSchema = z.object({
  action: z.enum(['create', 'get', 'addCredits', 'useCredits', 'addDocument', 'deleteDocument', 'migrate']),
  data: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    type: z.enum(['generated', 'uploaded', 'template']).optional(),
    amount: z.number().optional(),
    referrerCode: z.string().optional(),
  }).optional(),
});

type AuthCheckResult = { userId: string; isAnonymous: boolean } | NextResponse;

async function handleAuthCheck(request: NextRequest): Promise<AuthCheckResult> {
  const authHeader = request.headers.get('authorization');
  const anonId = request.cookies.get('anonId')?.value;

  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const { verifyAccessToken } = await import('@/lib/token-rotation');
      const payload = await verifyAccessToken(token);
      return { userId: payload.sub, isAnonymous: false };
    } catch {
      return NextResponse.json(
        { error: { message: 'Invalid token', code: 'INVALID_TOKEN' } },
        { status: 401 }
      );
    }
  }

  if (anonId) {
    return { userId: anonId, isAnonymous: true };
  }

  return { userId: uuidv4(), isAnonymous: true };
}

export async function GET(request: NextRequest) {
  try {
    const authCheck = await handleAuthCheck(request);
    if (authCheck instanceof NextResponse) return authCheck;

    const { userId, isAnonymous } = authCheck;

    if (!isAnonymous) {
      const useMongoDB = await getStoragePreference(userId);
      return NextResponse.json({
        success: true,
        data: {
          storageType: useMongoDB ? 'mongodb' : 'localStorage',
          isPro: false,
        },
      });
    }

    const user = getAnonymousUser();
    const credits = getAnonymousCredits();
    const documents = getAnonymousDocuments();

    return NextResponse.json({
      success: true,
      data: {
        id: user?.id || userId,
        credits,
        documents: documents.map((d) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          createdAt: d.createdAt,
        })),
        storageType: 'localStorage',
        expiresAt: userId ? Date.now() + 24 * 60 * 60 * 1000 : null,
      },
    });
  } catch (error) {
    console.error('Anonymous user error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = await handleAuthCheck(request);
    if (authCheck instanceof NextResponse) return authCheck;

    const { userId, isAnonymous } = authCheck;
    const body = await request.json();
    const { action, data } = anonymousUserSchema.parse(body);

    switch (action) {
      case 'create': {
        if (isAnonymous) {
          const user = createAnonymousUser();
          const response = NextResponse.json({
            success: true,
            data: {
              id: user.id,
              credits: user.credits,
              documents: [],
            },
          });
          response.cookies.set('anonId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
            path: '/',
          });
          return response;
        }
        break;
      }

      case 'addCredits': {
        if (isAnonymous && data?.amount) {
          addAnonymousCredits(data.amount);
          return NextResponse.json({
            success: true,
            data: { credits: getAnonymousCredits() },
          });
        }
        break;
      }

      case 'useCredits': {
        if (isAnonymous && data?.amount) {
          const success = deductAnonymousCredits(data.amount);
          return NextResponse.json({
            success,
            data: { credits: getAnonymousCredits() },
          });
        }
        break;
      }

      case 'addDocument': {
        if (isAnonymous && data?.title && data?.content && data?.type) {
          const doc = addAnonymousDocument(data.title, data.content, data.type);
          return NextResponse.json({
            success: true,
            data: { document: doc },
          });
        }
        break;
      }

      case 'deleteDocument': {
        if (isAnonymous && data?.title) {
          const documents = getAnonymousDocuments();
          const doc = documents.find((d) => d.title === data.title);
          if (doc) {
            deleteAnonymousDocument(doc.id);
            return NextResponse.json({ success: true });
          }
        }
        break;
      }

      case 'migrate': {
        if (!isAnonymous) {
          if (data?.referrerCode) {
            await User.findByIdAndUpdate(userId, { referredBy: data.referrerCode });
          }

          if (isAnonymous) {
            const { credits, documents } = migrateAnonymousToRegistered(userId);

            await User.findByIdAndUpdate(userId, { credits });

            for (const doc of documents) {
              await Document.create({
                userId,
                title: doc.title,
                content: doc.content,
                type: doc.type,
                status: 'completed',
                format: 'txt',
                storage: 'mongodb',
              });
            }

            deleteAnonymousUser();
          }

          return NextResponse.json({
            success: true,
            data: {
              storageType: 'mongodb',
              documentsMigrated: isAnonymous ? 0 : 0,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json(
      { error: { message: 'Invalid action', code: 'INVALID_ACTION' } },
      { status: 400 }
    );
  } catch (error) {
    console.error('Anonymous user error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}