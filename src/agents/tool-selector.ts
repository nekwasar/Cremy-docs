interface ToolMatch {
  id: string;
  label: string;
  requiresCredits: boolean;
  requiresFile: boolean;
  availableOnPages: string[];
}

const TOOL_REGISTRY: ToolMatch[] = [
  { id: 'generate_command', label: 'Generate from Command', requiresCredits: true, requiresFile: false, availableOnPages: ['/', '/generate'] },
  { id: 'generate_text', label: 'Generate from Text', requiresCredits: true, requiresFile: false, availableOnPages: ['/', '/generate'] },
  { id: 'edit', label: 'Edit Document', requiresCredits: true, requiresFile: false, availableOnPages: ['/', '/generate', '/preview'] },
  { id: 'convert', label: 'Convert File', requiresCredits: false, requiresFile: true, availableOnPages: ['/', '/convert'] },
  { id: 'translate', label: 'Translate', requiresCredits: true, requiresFile: false, availableOnPages: ['/', '/translate'] },
  { id: 'voice', label: 'Voice to Document', requiresCredits: true, requiresFile: false, availableOnPages: ['/', '/voice'] },
  { id: 'extract', label: 'Extract Text', requiresCredits: true, requiresFile: true, availableOnPages: ['/', '/extract-text', '/extract-text-from-pdf'] },
  { id: 'merge', label: 'Merge Files', requiresCredits: false, requiresFile: true, availableOnPages: ['/', '/merge-pdf'] },
  { id: 'split', label: 'Split File', requiresCredits: false, requiresFile: true, availableOnPages: ['/', '/split-pdf'] },
  { id: 'compress', label: 'Compress File', requiresCredits: false, requiresFile: true, availableOnPages: ['/', '/compress-pdf'] },
  { id: 'change_style', label: 'Change Style', requiresCredits: true, requiresFile: false, availableOnPages: ['/', '/generate', '/change-style'] },
];

interface PageContext {
  page: string;
  allowedTools: string[];
  isHomepage: boolean;
}

export function selectTool(
  intent: { id: string; label: string },
  pageContext: PageContext
): ToolMatch | null {
  const tool = TOOL_REGISTRY.find((t) => t.id === intent.id);
  if (!tool) return null;

  if (pageContext.isHomepage || tool.availableOnPages.includes(pageContext.page)) {
    return tool;
  }

  const homepage = TOOL_REGISTRY.find((t) => t.id === intent.id);
  if (homepage && homepage.availableOnPages.includes('/')) {
    return null;
  }

  return null;
}

export function getToolById(id: string): ToolMatch | undefined {
  return TOOL_REGISTRY.find((t) => t.id === id);
}

export function getToolsForPage(page: string): ToolMatch[] {
  if (page === '/' || page === '/generate') {
    return TOOL_REGISTRY;
  }
  return TOOL_REGISTRY.filter((t) => t.availableOnPages.includes(page));
}
