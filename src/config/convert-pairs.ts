export interface ConvertPair {
  id: string;
  slug: string;
  sourceFormat: string;
  sourceLabel: string;
  targetFormat: string;
  targetLabel: string;
  category: string;
  priority: number;
  description: string;
  seoTitle: string;
  seoDescription: string;
  contentSections: string[];
}

const SOURCE_LABELS: Record<string, string> = {
  doc: 'DOC', docx: 'DOCX', odt: 'ODT', rtf: 'RTF', txt: 'TXT',
  ppt: 'PPT', pptx: 'PPTX', odp: 'ODP',
  xls: 'XLS', xlsx: 'XLSX', ods: 'ODS', csv: 'CSV',
  epub: 'EPUB', mobi: 'MOBI', azw: 'AZW',
  html: 'HTML', md: 'Markdown',
  pdf: 'PDF',
  jpg: 'JPG', png: 'PNG', webp: 'WEBP', tiff: 'TIFF', bmp: 'BMP',
};

const WORD_FORMATS = ['doc', 'docx', 'odt', 'rtf', 'txt'];
const PRESENTATION_FORMATS = ['ppt', 'pptx', 'odp'];
const SPREADSHEET_FORMATS = ['xls', 'xlsx', 'ods', 'csv'];
const EBOOK_FORMATS = ['epub', 'mobi', 'azw'];
const MARKUP_FORMATS = ['html', 'md'];
const IMAGE_FORMATS = ['jpg', 'png', 'webp', 'tiff', 'bmp'];

function categorize(source: string, target: string): string {
  if (source === 'pdf' || target === 'pdf') return 'pdf-conversions';
  if (WORD_FORMATS.includes(source) && WORD_FORMATS.includes(target)) return 'word-processing';
  if (PRESENTATION_FORMATS.includes(source) || PRESENTATION_FORMATS.includes(target)) return 'presentations';
  if (SPREADSHEET_FORMATS.includes(source) || SPREADSHEET_FORMATS.includes(target)) return 'spreadsheets';
  if (EBOOK_FORMATS.includes(source) || EBOOK_FORMATS.includes(target)) return 'ebooks';
  if (IMAGE_FORMATS.includes(source) || IMAGE_FORMATS.includes(target)) return 'images';
  return 'cross-category';
}

function buildPair(
  source: string,
  target: string,
  priority: number
): ConvertPair {
  const slug = `${source}-to-${target}`;
  const sourceLabel = SOURCE_LABELS[source] || source.toUpperCase();
  const targetLabel = SOURCE_LABELS[target] || target.toUpperCase();

  return {
    id: slug,
    slug,
    sourceFormat: source,
    sourceLabel,
    targetFormat: target,
    targetLabel,
    category: categorize(source, target),
    priority,
    description: `Convert ${sourceLabel} files to ${targetLabel} format online for free. Preserves formatting, layout, and content quality.`,
    seoTitle: `Convert ${sourceLabel} to ${targetLabel} — Free Online Converter | Cremy Docs`,
    seoDescription: `Convert ${sourceLabel} files to ${targetLabel} format instantly. Free online conversion preserves formatting, fonts, images, and layout. No registration, no watermarks, no credits needed.`,
    contentSections: [sourceLabel, targetLabel, slug],
  };
}

function generateAllPairs(): ConvertPair[] {
  const pairs: ConvertPair[] = [];
  const seen = new Set<string>();
  let priority = 80;

  const addPair = (source: string, target: string, p: number) => {
    if (source === target) return;
    const slug = `${source}-to-${target}`;
    if (seen.has(slug)) return;
    seen.add(slug);
    pairs.push(buildPair(source, target, p));
  };

  for (const s of WORD_FORMATS) {
    for (const t of WORD_FORMATS) addPair(s, t, priority);
    addPair(s, 'pdf', 100);
  }
  for (const t of WORD_FORMATS) addPair('pdf', t, 100);

  for (const s of PRESENTATION_FORMATS) {
    for (const t of PRESENTATION_FORMATS) addPair(s, t, priority);
    addPair(s, 'pdf', 90);
  }
  for (const t of PRESENTATION_FORMATS) addPair('pdf', t, 90);

  for (const s of SPREADSHEET_FORMATS) {
    for (const t of SPREADSHEET_FORMATS) addPair(s, t, priority);
    addPair(s, 'pdf', 85);
  }
  for (const t of SPREADSHEET_FORMATS) addPair('pdf', t, 85);

  for (const s of EBOOK_FORMATS) addPair(s, 'pdf', 75);
  for (const t of EBOOK_FORMATS) addPair('pdf', t, 75);

  for (const s of MARKUP_FORMATS) {
    addPair(s, 'pdf', 80);
    addPair(s, 'docx', 80);
  }

  const crossCategoryPairs: [string, string, number][] = [
    ['doc', 'pptx', 70], ['docx', 'pptx', 70], ['odt', 'pptx', 70], ['rtf', 'pptx', 70], ['txt', 'pptx', 70],
    ['doc', 'odp', 70], ['docx', 'odp', 70], ['odt', 'odp', 70], ['rtf', 'odp', 70], ['txt', 'odp', 70],
    ['pptx', 'docx', 70], ['odp', 'docx', 70], ['pptx', 'rtf', 70], ['odp', 'rtf', 70], ['pptx', 'txt', 70],
    ['doc', 'xlsx', 65], ['docx', 'xlsx', 65], ['txt', 'csv', 65], ['csv', 'docx', 65], ['xlsx', 'docx', 65],
    ['ods', 'docx', 65], ['xlsx', 'rtf', 65], ['csv', 'txt', 65], ['xls', 'docx', 65], ['xlsx', 'odt', 65],
    ['doc', 'html', 65], ['docx', 'html', 65], ['doc', 'md', 65], ['docx', 'md', 65], ['pdf', 'html', 65],
    ['pdf', 'md', 65], ['pptx', 'html', 65], ['xlsx', 'html', 65], ['epub', 'html', 65], ['html', 'md', 65],
  ];
  for (const [s, t, p] of crossCategoryPairs) addPair(s, t, p);

  for (const s of IMAGE_FORMATS) {
    addPair(s, 'pdf', 70);
    addPair(s, 'jpg', 70);
    addPair(s, 'png', 70);
    addPair(s, 'webp', 70);
    addPair(s, 'docx', 65);
  }
  for (const t of IMAGE_FORMATS) addPair('pdf', t, 70);

  const imgToDoc: [string, string, number][] = [
    ['jpg', 'doc', 60], ['png', 'doc', 60], ['jpg', 'odt', 60], ['png', 'rtf', 60],
    ['jpg', 'txt', 60], ['png', 'txt', 60], ['webp', 'docx', 60], ['jpg', 'xlsx', 55],
    ['png', 'csv', 55], ['jpg', 'html', 55], ['png', 'md', 55], ['png', 'odp', 55],
    ['jpg', 'ppt', 55], ['png', 'ppt', 55], ['webp', 'pptx', 55], ['tiff', 'docx', 55],
    ['tiff', 'png', 55], ['bmp', 'pdf', 55],
  ];
  for (const [s, t, p] of imgToDoc) addPair(s, t, p);

  const remaining: [string, string, number][] = [
    ['pdf', 'epub', 70], ['pdf', 'mobi', 70], ['pdf', 'azw', 70], ['pdf', 'jpg', 70],
    ['pdf', 'png', 70], ['pdf', 'webp', 70], ['pdf', 'tiff', 70],
    ['docx', 'ppt', 60], ['odt', 'ppt', 60], ['xlsx', 'ppt', 55], ['csv', 'ppt', 55],
    ['pptx', 'xlsx', 55], ['pptx', 'csv', 55], ['epub', 'docx', 55], ['mobi', 'docx', 55],
    ['html', 'pptx', 55],
  ];
  for (const [s, t, p] of remaining) addPair(s, t, p);

  while (pairs.length < 200) {
    const allSources = [...WORD_FORMATS, ...PRESENTATION_FORMATS, ...SPREADSHEET_FORMATS, ...EBOOK_FORMATS, ...MARKUP_FORMATS, ...IMAGE_FORMATS, 'pdf'];
    for (const s of allSources) {
      for (const t of allSources) {
        if (pairs.length >= 200) break;
        addPair(s, t, 50);
      }
    }
  }

  return pairs.slice(0, 200);
}

export const CONVERT_PAIRS: ConvertPair[] = generateAllPairs();

export function getPairBySlug(slug: string): ConvertPair | undefined {
  return CONVERT_PAIRS.find((p) => p.slug === slug);
}

export function getPairsByCategory(category: string): ConvertPair[] {
  return CONVERT_PAIRS.filter((p) => p.category === category);
}

export function getRelatedPairs(slug: string, count: number = 8): ConvertPair[] {
  const pair = getPairBySlug(slug);
  if (!pair) return [];

  return CONVERT_PAIRS.filter(
    (p) =>
      p.slug !== slug &&
      (p.sourceFormat === pair.sourceFormat ||
        p.targetFormat === pair.targetFormat ||
        p.sourceFormat === pair.targetFormat ||
        p.targetFormat === pair.sourceFormat)
  ).slice(0, count);
}

export function getCategoryLabels(): Record<string, string> {
  return {
    'word-processing': 'Word Processing',
    'presentations': 'Presentations',
    'spreadsheets': 'Spreadsheets',
    'ebooks': 'eBooks',
    'pdf-conversions': 'PDF Conversions',
    'images': 'Images',
    'cross-category': 'Cross-Category',
  };
}
