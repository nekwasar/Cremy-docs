export function detectFormat(fileName: string, mimeType?: string): { format: string; confidence: 'high' | 'medium' | 'low' } {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const extensionMap: Record<string, string> = {
    pdf: 'pdf', doc: 'doc', docx: 'docx', odt: 'odt', rtf: 'rtf', txt: 'txt',
    ppt: 'ppt', pptx: 'pptx', odp: 'odp',
    xls: 'xls', xlsx: 'xlsx', ods: 'ods', csv: 'csv',
    epub: 'epub', mobi: 'mobi', azw: 'azw',
    html: 'html', htm: 'html', md: 'md',
    jpg: 'jpg', jpeg: 'jpg', png: 'png', webp: 'webp', tiff: 'tiff', tif: 'tiff', bmp: 'bmp',
  };

  const mimeMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.oasis.opendocument.text': 'odt',
    'application/rtf': 'rtf', 'text/rtf': 'rtf',
    'text/plain': 'txt',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.oasis.opendocument.presentation': 'odp',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.oasis.opendocument.spreadsheet': 'ods',
    'text/csv': 'csv',
    'application/epub+zip': 'epub',
    'application/x-mobipocket-ebook': 'mobi',
    'text/html': 'html',
    'text/markdown': 'md',
  };

  if (mimeType && mimeMap[mimeType]) {
    return { format: mimeMap[mimeType], confidence: 'high' };
  }

  if (extension && extensionMap[extension]) {
    return { format: extensionMap[extension], confidence: 'medium' };
  }

  return { format: extension || 'unknown', confidence: 'low' };
}

export function getCompatibleTargets(sourceFormat: string): string[] {
  const all = ['pdf', 'docx', 'doc', 'odt', 'rtf', 'txt', 'pptx', 'xlsx', 'csv', 'html', 'md', 'jpg', 'png'];
  return all.filter((t) => t !== sourceFormat);
}
