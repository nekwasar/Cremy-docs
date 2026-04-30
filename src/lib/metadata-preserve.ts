interface DocumentMetadata {
  title?: string;
  author?: string;
  createdAt?: string;
  modifiedAt?: string;
  pageCount?: number;
  wordCount?: number;
}

export function extractMetadata(content: string): DocumentMetadata {
  const metadata: DocumentMetadata = {};

  const titleMatch = content.match(/^#\s+(.+)/m);
  if (titleMatch) metadata.title = titleMatch[1];

  const words = content.split(/\s+/).filter(Boolean).length;
  metadata.wordCount = words;

  const pageEstimate = Math.ceil(words / 500);
  metadata.pageCount = pageEstimate;

  return metadata;
}

export function preserveMetadataInOutput(
  content: string,
  metadata: DocumentMetadata,
  targetFormat: string
): string {
  let output = content;

  if (metadata.title && !content.includes(metadata.title)) {
    if (targetFormat === 'md' || targetFormat === 'txt') {
      output = `# ${metadata.title}\n\n${output}`;
    }
  }

  if (metadata.author) {
    output += `\n\nAuthor: ${metadata.author}`;
  }

  return output;
}
