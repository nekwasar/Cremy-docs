import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateDocument } from '@/lib/ai-generation';
import { buildEditPrompt } from '@/lib/prompt-builder';
import { saveDocument, loadDocument } from '@/lib/document-save';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { instruction } = body;

    const existingDoc = await loadDocument(id, session.user.id);
    
    if (!existingDoc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const prompt = buildEditPrompt(existingDoc.content, instruction);

    const document = await generateDocument({
      prompt,
      onChunk: (chunk) => {
        console.log('Chunk:', chunk);
      },
    });

    document.id = id;
    document.userId = session.user.id;
    document.versions = (existingDoc.versions || 1) + 1;

    await saveDocument(session.user.id, document);

    return NextResponse.json({
      success: true,
      data: { document },
    });
  } catch (error) {
    console.error('Edit error:', error);
    return NextResponse.json({ success: false, error: 'Edit failed' }, { status: 500 });
  }
}