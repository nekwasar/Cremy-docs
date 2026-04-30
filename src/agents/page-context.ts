interface PageConfig {
  page: string;
  allowedTools: string[];
  isHomepage: boolean;
  suggestsHomepage: boolean;
}

const PAGE_CONFIGS: Record<string, PageConfig> = {
  '/': { page: '/', allowedTools: ['generate_command', 'generate_text', 'edit', 'convert', 'translate', 'voice', 'extract', 'merge', 'split', 'compress', 'change_style'], isHomepage: true, suggestsHomepage: false },
  '/generate': { page: '/generate', allowedTools: ['generate_command', 'generate_text', 'edit', 'change_style'], isHomepage: false, suggestsHomepage: true },
  '/translate': { page: '/translate', allowedTools: ['translate'], isHomepage: false, suggestsHomepage: true },
  '/convert': { page: '/convert', allowedTools: ['convert'], isHomepage: false, suggestsHomepage: true },
  '/voice': { page: '/voice', allowedTools: ['voice'], isHomepage: false, suggestsHomepage: true },
  '/extract-text': { page: '/extract-text', allowedTools: ['extract'], isHomepage: false, suggestsHomepage: true },
  '/extract-text-from-pdf': { page: '/extract-text-from-pdf', allowedTools: ['extract'], isHomepage: false, suggestsHomepage: true },
  '/merge-pdf': { page: '/merge-pdf', allowedTools: ['merge'], isHomepage: false, suggestsHomepage: true },
  '/split-pdf': { page: '/split-pdf', allowedTools: ['split'], isHomepage: false, suggestsHomepage: true },
  '/compress-pdf': { page: '/compress-pdf', allowedTools: ['compress'], isHomepage: false, suggestsHomepage: true },
  '/change-style': { page: '/change-style', allowedTools: ['change_style'], isHomepage: false, suggestsHomepage: true },
  '/preview': { page: '/preview', allowedTools: ['edit'], isHomepage: false, suggestsHomepage: true },
};

export function getPageContext(path: string): PageConfig {
  for (const [route, config] of Object.entries(PAGE_CONFIGS)) {
    if (path === route || path.startsWith(route + '?')) {
      return config;
    }
  }
  return {
    page: path,
    allowedTools: [],
    isHomepage: false,
    suggestsHomepage: true,
  };
}

export function isToolAllowedOnPage(toolId: string, page: string): boolean {
  const config = getPageContext(page);
  return config.isHomepage || config.allowedTools.includes(toolId);
}

export function getSuggestedPage(toolId: string): string | null {
  const toolPageMap: Record<string, string> = {
    generate_command: '/generate',
    generate_text: '/generate',
    edit: '/preview',
    convert: '/convert',
    translate: '/translate',
    voice: '/voice',
    extract: '/extract-text',
    merge: '/merge-pdf',
    split: '/split-pdf',
    compress: '/compress-pdf',
    change_style: '/change-style',
  };
  return toolPageMap[toolId] || '/';
}
