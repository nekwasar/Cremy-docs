import { NextRequest, NextResponse } from 'next/server';
import { FORMATS, FORMAT_CATEGORIES, getFormatsByCategory } from '@/config/formats';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let formats = FORMATS;

    if (category) {
      formats = getFormatsByCategory(category);
    }

    return NextResponse.json({
      success: true,
      data: {
        formats,
        total: formats.length,
        categories: FORMAT_CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name,
          count: c.formats.length,
        })),
      },
    });
  } catch (error) {
    console.error('Formats API error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}