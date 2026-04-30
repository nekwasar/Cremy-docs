interface AutoDetectResult {
  formatType: string;
  confidence: number;
  reason: string;
}

const DETECTORS: Array<{
  keywords: string[];
  formatType: string;
  label: string;
}> = [
  {
    keywords: ['invoice', 'bill', 'payment', 'due date', 'amount', 'total', 'client'],
    formatType: 'invoice',
    label: 'detected invoice keywords',
  },
  {
    keywords: ['contract', 'agreement', 'terms', 'obligations', 'party', 'parties', 'shall'],
    formatType: 'contract',
    label: 'detected contract keywords',
  },
  {
    keywords: ['proposal', 'solution', 'timeline', 'pricing', 'deliverables', 'scope'],
    formatType: 'proposal',
    label: 'detected proposal keywords',
  },
  {
    keywords: ['report', 'findings', 'analysis', 'conclusion', 'recommend', 'summary'],
    formatType: 'report',
    label: 'detected report keywords',
  },
  {
    keywords: ['resume', 'cv', 'experience', 'skills', 'education', 'work history'],
    formatType: 'resume',
    label: 'detected resume keywords',
  },
  {
    keywords: ['research', 'study', 'methodology', 'literature', 'abstract', 'references', 'cite'],
    formatType: 'research-paper',
    label: 'detected research keywords',
  },
  {
    keywords: ['blog', 'post', 'article', 'newsletter', 'subscribe', 'audience'],
    formatType: 'blog-post',
    label: 'detected content format keywords',
  },
  {
    keywords: ['nda', 'non-disclosure', 'confidential', 'trade secret', 'proprietary'],
    formatType: 'nda',
    label: 'detected NDA keywords',
  },
  {
    keywords: ['story', 'character', 'plot', 'scene', 'narrative', 'chapter', 'fiction'],
    formatType: 'story',
    label: 'detected story keywords',
  },
];

export function autoDetectFormat(text: string): AutoDetectResult {
  const lowerText = text.toLowerCase();

  for (const detector of DETECTORS) {
    const matchedCount = detector.keywords.filter((kw) => lowerText.includes(kw)).length;
    const confidence = matchedCount / detector.keywords.length;

    if (confidence >= 0.3) {
      return {
        formatType: detector.formatType,
        confidence: Math.min(confidence, 0.95),
        reason: detector.label,
      };
    }
  }

  return {
    formatType: 'essay',
    confidence: 0.3,
    reason: 'no specific format detected, using essay format',
  };
}

export function getAutoDetectPrompt(text: string, detected: AutoDetectResult): string {
  return `Based on analysis, this appears to be a "${detected.formatType}" document (confidence: ${Math.round(detected.confidence * 100)}%, reason: ${detected.reason}). Generate the document in ${detected.formatType} format.`;
}