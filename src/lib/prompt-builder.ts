interface PromptOptions {
  text: string;
  template?: {
    id: string;
    name: string;
    structure: string;
  };
  tone?: string;
  format?: string;
}

export function buildGeneratePrompt(options: PromptOptions): string {
  let prompt = '';

  if (options.template) {
    prompt += `Generate a ${options.template.name} document based on the following structure:\n${options.template.structure}\n\n`;
  }

  if (options.tone) {
    prompt += `Write in a ${options.tone} tone.\n\n`;
  }

  if (options.format) {
    prompt += `Use ${options.format} format.\n\n`;
  }

  prompt += `Content to expand:\n${options.text}`;

  return prompt;
}

export function buildEditPrompt(documentContent: string, instruction: string): string {
  return `Current document:\n${documentContent}\n\nEdit instruction: ${instruction}\n\nApply the edit and return the updated document.`;
}

export function buildFormatPrompt(text: string, formatName: string): string {
  return `Format the following text as ${formatName}:\n\n${text}`;
}

export function buildTranslatePrompt(text: string, targetLang: string, sourceLang?: string): string {
  const sourcePart = sourceLang ? ` from ${sourceLang}` : '';
  return `Translate the following text to ${targetLang}${sourcePart}:\n\n${text}`;
}

export function buildSummarizePrompt(text: string): string {
  return `Summarize the following text concisely:\n\n${text}`;
}