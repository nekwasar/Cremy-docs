import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateDocument } from '@/lib/ai-generation';
import { buildGeneratePrompt } from '@/lib/prompt-builder';
import { validateInput } from '@/lib/input-validation';
import { saveDocument } from '@/lib/document-save';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, formatId, tone, templateId } = body;

    const validation = validateInput(text);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.errors.join(', ') }, { status: 400 });
    }

    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ _id: session.user.id });
    
    if (!user || user.credits < 1) {
      return NextResponse.json({ success: false, error: 'Insufficient credits' }, { status: 402 });
    }

    await db.collection('users').updateOne(
      { _id: session.user.id },
      { $inc: { credits: -1 } }
    );

    const template = templateId
      ? await db.collection('templates').findOne({ _id: templateId })
      : null;

    const prompt = buildGeneratePrompt({
      text,
      template: template as any,
      tone,
      format: formatId,
    });

    let content = '';
    const document = await generateDocument({
      prompt,
      onChunk: (chunk) => {
        content += chunk;
      },
    });

    document.userId = session.user.id;
    const savedId = await saveDocument(session.user.id, document, templateId);

    return NextResponse.json({
      success: true,
      data: { document: { ...document, id: savedId } },
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }
}