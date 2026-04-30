interface ClarificationOption {
  id: string;
  label: string;
  description: string;
}

interface ClarificationResult {
  message: string;
  options: ClarificationOption[];
}

export function handleClarification(
  intent: { all: Array<{ id: string; label: string; confidence: number }> },
  originalMessage: string
): ClarificationResult {
  const options: ClarificationOption[] = intent.all.map((item) => ({
    id: item.id,
    label: item.label,
    description: getDescriptionForTool(item.id),
  }));

  return {
    message: `I'm not quite sure what you want to do. Which of these did you mean?`,
    options,
  };
}

function getDescriptionForTool(toolId: string): string {
  const descriptions: Record<string, string> = {
    generate_command: 'Tell me what to create and I will generate a document',
    generate_text: 'Paste your text and I will format it into a document',
    edit: 'Modify, improve, or rewrite parts of your document',
    convert: 'Change your file to a different format',
    translate: 'Translate your document to another language',
    voice: 'Record your voice and convert it to a document',
    extract: 'Pull text out of a PDF or image',
    merge: 'Combine multiple files into one',
    split: 'Separate pages from a document',
    compress: 'Reduce the file size of your document',
    change_style: 'Apply a new style or theme to your document',
  };
  return descriptions[toolId] || 'Process your document';
}
