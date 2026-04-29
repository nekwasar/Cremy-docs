import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai-generation';
import { buildTranslatePrompt } from '@/lib/prompt-builder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLang, sourceLang } = body;

    if (!text || !targetLang) {
      return NextResponse.json(
        { success: false, error: 'Missing text or targetLang' },
        { status: 400 }
      );
    }

    const prompt = buildTranslatePrompt(text, targetLang, sourceLang);

    let translatedText = '';
    await generateDocument({
      prompt,
      onChunk: (chunk) => {
        translatedText += chunk;
      },
    });

    return NextResponse.json({
      success: true,
      data: { translatedText },
    });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json(
      { success: false, error: 'Translation failed' },
      { status: 500 }
    );
  }
}