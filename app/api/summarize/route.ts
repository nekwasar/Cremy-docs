import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai-generation';
import { buildSummarizePrompt } from '@/lib/prompt-builder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Missing text' },
        { status: 400 }
      );
    }

    const prompt = buildSummarizePrompt(text);

    let summary = '';
    await generateDocument({
      prompt,
      onChunk: (chunk) => {
        summary += chunk;
      },
    });

    return NextResponse.json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json(
      { success: false, error: 'Summarization failed' },
      { status: 500 }
    );
  }
}