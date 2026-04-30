export interface FormatConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  creditCost: number;
  previewUrl?: string;
}

export const FORMATS: FormatConfig[] = [
  { id: 'invoice', name: 'Invoice', description: 'Professional invoice for billing clients and tracking payments', category: 'business', creditCost: 3, previewUrl: '' },
  { id: 'contract', name: 'Contract', description: 'Legally-structured contract for business agreements', category: 'business', creditCost: 5, previewUrl: '' },
  { id: 'proposal', name: 'Proposal', description: 'Compelling business proposal to win clients and projects', category: 'business', creditCost: 4, previewUrl: '' },
  { id: 'report', name: 'Report', description: 'Detailed business report with data analysis and findings', category: 'business', creditCost: 4, previewUrl: '' },
  { id: 'memo', name: 'Memo', description: 'Internal memorandum for company communications', category: 'business', creditCost: 2, previewUrl: '' },
  { id: 'essay', name: 'Essay', description: 'Well-structured academic essay with thesis and arguments', category: 'academic', creditCost: 4, previewUrl: '' },
  { id: 'research-paper', name: 'Research Paper', description: 'Comprehensive research paper with methodology and citations', category: 'academic', creditCost: 6, previewUrl: '' },
  { id: 'thesis', name: 'Thesis', description: 'Academic thesis with chapters, abstract, and bibliography', category: 'academic', creditCost: 8, previewUrl: '' },
  { id: 'summary', name: 'Summary', description: 'Concise academic summary of papers and articles', category: 'academic', creditCost: 2, previewUrl: '' },
  { id: 'nda', name: 'NDA', description: 'Non-disclosure agreement to protect confidential information', category: 'legal', creditCost: 4, previewUrl: '' },
  { id: 'agreement', name: 'Agreement', description: 'Formal legal agreement between parties', category: 'legal', creditCost: 5, previewUrl: '' },
  { id: 'letter', name: 'Letter', description: 'Formal legal letter with proper formatting', category: 'legal', creditCost: 2, previewUrl: '' },
  { id: 'resume', name: 'Resume', description: 'Professional resume highlighting skills and experience', category: 'personal', creditCost: 3, previewUrl: '' },
  { id: 'cover-letter', name: 'Cover Letter', description: 'Tailored cover letter for job applications', category: 'personal', creditCost: 2, previewUrl: '' },
  { id: 'cv', name: 'CV', description: 'Comprehensive curriculum vitae for academic positions', category: 'personal', creditCost: 4, previewUrl: '' },
  { id: 'story', name: 'Story', description: 'Creative short story with characters and plot', category: 'creative', creditCost: 5, previewUrl: '' },
  { id: 'blog-post', name: 'Blog Post', description: 'Engaging blog post with SEO optimization', category: 'creative', creditCost: 3, previewUrl: '' },
  { id: 'newsletter', name: 'Newsletter', description: 'Professional newsletter for email distribution', category: 'creative', creditCost: 3, previewUrl: '' },
];

export const FORMAT_CATEGORIES = [
  { id: 'business', name: 'Business', formats: FORMATS.filter((f) => f.category === 'business') },
  { id: 'academic', name: 'Academic', formats: FORMATS.filter((f) => f.category === 'academic') },
  { id: 'legal', name: 'Legal', formats: FORMATS.filter((f) => f.category === 'legal') },
  { id: 'personal', name: 'Personal', formats: FORMATS.filter((f) => f.category === 'personal') },
  { id: 'creative', name: 'Creative', formats: FORMATS.filter((f) => f.category === 'creative') },
];

export function getFormatById(id: string): FormatConfig | undefined {
  return FORMATS.find((f) => f.id === id);
}

export function getFormatsByCategory(category: string): FormatConfig[] {
  return FORMATS.filter((f) => f.category === category);
}

export function getFormatIds(): string[] {
  return FORMATS.map((f) => f.id);
}