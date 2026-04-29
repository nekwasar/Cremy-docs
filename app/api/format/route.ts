import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai-generation';
import { buildFormatPrompt } from '@/lib/prompt-builder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, formatId } = body;

    if (!text || !formatId) {
      return NextResponse.json(
        { success: false, error: 'Missing text or formatId' },
        { status: 400 }
      );
    }

    const prompt = buildFormatPrompt(text, formatId);

    let formattedText = '';
    await generateDocument({
      prompt,
      onChunk: (chunk) => {
        formattedText += chunk;
      },
    });

    return NextResponse.json({
      success: true,
      data: { formattedText },
    });
  } catch (error) {
    console.error('Format error:', error);
    return NextResponse.json(
      { success: false, error: 'Format failed' },
      { status: 500 }
    );
  }
}