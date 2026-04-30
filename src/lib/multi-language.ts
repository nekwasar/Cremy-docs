const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

export function getSupportedLanguages(): { code: string; name: string }[] {
  return SUPPORTED_LANGUAGES;
}

export function getLanguageByCode(code: string): { code: string; name: string } | undefined {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code);
}

export function buildMultiLanguagePrompt(text: string, language: string): string {
  return `Write in ${language} language:\n\n${text}`;
}

export function getDefaultLanguage(): string {
  return 'en';
}
