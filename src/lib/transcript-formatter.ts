const FILLER_WORDS = /\b(um|uh|er|ah|like|you know|i mean|sort of|kind of|basically|actually|literally|right|okay so)\b/gi;

export function removeFillerWords(text: string): string {
  let cleaned = text.replace(FILLER_WORDS, '');
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  cleaned = cleaned.replace(/\.\s*\./g, '.');
  return cleaned.trim();
}

export function structureIntoDocument(text: string): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  if (sentences.length === 0) return text;

  let document = '';

  const firstSentence = sentences[0];
  const titleWords = firstSentence.split(' ').slice(0, 8);
  const title = titleWords.join(' ') + (titleWords.length < firstSentence.split(' ').length ? '...' : '');
  document += `# ${title}\n\n`;

  if (sentences.length <= 3) {
    document += sentences.join(' ');
    return document;
  }

  const introEnd = Math.min(3, Math.floor(sentences.length * 0.2));
  document += '## Introduction\n\n';
  document += sentences.slice(0, introEnd).join(' ') + '\n\n';

  const bodyStart = introEnd;
  const bodyEnd = sentences.length - 2;
  if (bodyEnd > bodyStart) {
    document += '## Content\n\n';
    const body = sentences.slice(bodyStart, bodyEnd).join(' ');
    document += body + '\n\n';
  }

  if (sentences.length > 2) {
    document += '## Summary\n\n';
    document += sentences.slice(-2).join(' ') + '\n\n';
  }

  return document;
}

export function formatTranscript(transcription: string): string {
  const cleaned = removeFillerWords(transcription);
  const structured = structureIntoDocument(cleaned);
  return structured;
}
