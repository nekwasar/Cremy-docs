import { NextRequest, NextResponse } from 'next/server';
import { getFormatById } from '@/config/formats';
import { getFormatPrompt } from '@/config/format-prompts';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const format = getFormatById(id);
    if (!format) {
      return NextResponse.json({ success: false, error: 'Format not found' }, { status: 404 });
    }

    const prompt = getFormatPrompt(id);

    return NextResponse.json({
      success: true,
      data: {
        format,
        prompt: prompt || null,
      },
    });
  } catch (error) {
    console.error('Format API error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}