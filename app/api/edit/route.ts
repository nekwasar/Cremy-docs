import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateDocument } from '@/lib/ai-generation';
import { buildEditPrompt } from '@/lib/prompt-builder';
import { loadDocument, saveDocument } from '@/lib/document-save';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { documentId, instruction, elementId } = body;

    if (!documentId || !instruction) {
      return NextResponse.json(
        { success: false, error: 'documentId and instruction are required' },
        { status: 400 }
      );
    }

    const userId = session?.user?.id;
    if (!userId) {
      const existingDoc = await loadDocument(documentId, 'anonymous');
      if (!existingDoc) {
        return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
      }

      const prompt = elementId
        ? buildEditPrompt(existingDoc.content, `Focus on element ${elementId}: ${instruction}`)
        : buildEditPrompt(existingDoc.content, instruction);

      const updatedDoc = await generateDocument({ prompt });

      return NextResponse.json({
        success: true,
        data: { document: updatedDoc },
      });
    }

    const existingDoc = await loadDocument(documentId, userId);
    if (!existingDoc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const prompt = elementId
      ? buildEditPrompt(existingDoc.content, `Focus on element ${elementId}: ${instruction}`)
      : buildEditPrompt(existingDoc.content, instruction);

    let content = '';
    const document = await generateDocument({
      prompt,
      onChunk: (chunk) => { content += chunk; },
    });

    document.id = documentId;
    document.userId = userId;
    document.versions = (existingDoc.versions || 1) + 1;

    await saveDocument(userId, document);

    return NextResponse.json({
      success: true,
      data: { document },
    });
  } catch (error) {
    console.error('Edit API error:', error);
    return NextResponse.json({ success: false, error: 'Edit failed' }, { status: 500 });
  }
}
