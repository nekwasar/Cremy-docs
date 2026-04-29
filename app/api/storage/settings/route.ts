import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import { getStorageSettings, toggleStorage } from '@/lib/storage-toggle';
import { withAuth, AuthUser } from '@/lib/auth';

const toggleSchema = z.object({
  enable: z.boolean(),
  migrateData: z.boolean().optional().default(true),
});

async function settingsHandler(request: NextRequest, user: AuthUser) {
  try {
    await connectDB();

    if (request.method === 'GET') {
      const settings = await getStorageSettings(user.sub);
      return NextResponse.json({ success: true, data: settings });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const validatedData = toggleSchema.parse(body);

      const result = await toggleStorage(user.sub, validatedData.enable, validatedData.migrateData);

      if (!result.success) {
        return NextResponse.json(
          { error: { message: result.message, code: 'STORAGE_TOGGLE_FAILED' } },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { storageType: result.storageType },
        message: result.message,
      });
    }

    return NextResponse.json(
      { error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' } },
      { status: 405 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }

    console.error('Storage settings error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export const GET = withAuth(settingsHandler);
export const POST = withAuth(settingsHandler);