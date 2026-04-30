import { NextRequest, NextResponse } from 'next/server';
import { parseInputContent } from '@/lib/input-parser';
import { formatOutputForTarget } from '@/lib/output-formatter';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const targetFormat = (formData.get('targetFormat') as string) || 'pdf';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const content = await file.text();
      const formatted = formatOutputForTarget(content, targetFormat);

      return new NextResponse(formatted, {
        headers: {
          'Content-Type': getContentType(targetFormat),
          'Content-Disposition': `attachment; filename="converted.${targetFormat}"`,
        },
      });
    }

    const body = await request.json();
    const { content, targetFormat = 'pdf' } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: 'No content provided' }, { status: 400 });
    }

    const formatted = formatOutputForTarget(content, targetFormat);

    return new NextResponse(formatted, {
      headers: {
        'Content-Type': getContentType(targetFormat),
        'Content-Disposition': `attachment; filename="converted.${targetFormat}"`,
      },
    });
  } catch (error) {
    console.error('Conversion API error:', error);
    return NextResponse.json({ success: false, error: 'Conversion failed' }, { status: 500 });
  }
}

function getContentType(format: string): string {
  const types: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    odt: 'application/vnd.oasis.opendocument.text',
    rtf: 'application/rtf',
    txt: 'text/plain',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    odp: 'application/vnd.oasis.opendocument.presentation',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    csv: 'text/csv',
    epub: 'application/epub+zip',
    html: 'text/html',
    md: 'text/markdown',
  };
  return types[format] || 'application/octet-stream';
}
