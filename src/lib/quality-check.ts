export function checkConversionQuality(
  originalContent: string,
  convertedContent: string,
  targetFormat: string
): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  if (convertedContent.length < originalContent.length * 0.5) {
    issues.push('Significant content loss detected');
    score -= 30;
  }

  if (convertedContent.trim().length === 0) {
    issues.push('Converted file is empty');
    score = 0;
  }

  const originalHeadings = (originalContent.match(/^#+\s/gm) || []).length;
  const convertedHeadings = (convertedContent.match(/^#+\s/gm) || []).length;
  if (originalHeadings > 0 && convertedHeadings < originalHeadings * 0.5) {
    issues.push('Heading structure partially lost during conversion');
    score -= 15;
  }

  const originalTables = (originalContent.match(/\|/g) || []).length;
  const convertedTables = (convertedContent.match(/\|/g) || []).length;
  if (originalTables > 0 && convertedTables < originalTables * 0.7) {
    issues.push('Table formatting may be degraded');
    score -= 10;
  }

  if (targetFormat === 'pdf' && !convertedContent.includes('PDF')) {
    issues.push('PDF-specific formatting not detected');
    score -= 5;
  }

  return { score: Math.max(0, score), issues };
}
