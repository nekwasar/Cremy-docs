export interface Section {
  id: string;
  heading: string;
  content: string;
  order: number;
}

export interface DocumentMetadata {
  wordCount: number;
  createdAt: Date;
  tone: string;
  format: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  format: string;
  sections: Section[];
  metadata: DocumentMetadata;
  userId: string;
  templateId?: string;
  status: 'draft' | 'complete' | 'partial';
  versions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateRequest {
  text: string;
  formatId?: string;
  tone?: string;
  templateId?: string;
}

export interface GenerateResponse {
  document: Document;
}

export interface EditRequest {
  documentId: string;
  instruction: string;
}

export interface EditResponse {
  document: Document;
}

export interface FormatRequest {
  text: string;
  formatId: string;
}

export interface FormatResponse {
  formattedText: string;
}

export interface TranslateRequest {
  text: string;
  targetLang: string;
  sourceLang?: string;
}

export interface TranslateResponse {
  translatedText: string;
}

export interface SummarizeRequest {
  text: string;
}

export interface SummarizeResponse {
  summary: string;
}