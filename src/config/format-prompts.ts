export interface FormatPrompt {
  systemPrompt: string;
  userPromptTemplate: string;
  outputSchema: Record<string, any>;
}

export const FORMAT_PROMPTS: Record<string, FormatPrompt> = {
  invoice: {
    systemPrompt: 'You are a professional invoice generator. Generate well-structured invoices with all required fields.',
    userPromptTemplate: 'Generate an invoice based on the following details:\n{input}\n\nInclude: invoice number, date, biller details, client details, line items with quantities and prices, subtotal, tax, and total.',
    outputSchema: { required: ['invoiceNumber', 'date', 'biller', 'client', 'lineItems', 'total'], type: 'invoice' },
  },
  contract: {
    systemPrompt: 'You are a legal contract drafter. Generate clear and comprehensive contracts.',
    userPromptTemplate: 'Generate a contract based on:\n{input}\n\nInclude: parties, terms, obligations, payment terms, duration, termination clauses, and signatures.',
    outputSchema: { required: ['parties', 'terms', 'obligations', 'paymentTerms', 'duration', 'signatures'], type: 'contract' },
  },
  proposal: {
    systemPrompt: 'You are a business proposal writer. Generate persuasive and professional proposals.',
    userPromptTemplate: 'Generate a business proposal for:\n{input}\n\nInclude: executive summary, problem statement, proposed solution, timeline, pricing, and call to action.',
    outputSchema: { required: ['executiveSummary', 'problem', 'solution', 'timeline', 'pricing'], type: 'proposal' },
  },
  report: {
    systemPrompt: 'You are a business report generator. Generate detailed analytical reports.',
    userPromptTemplate: 'Generate a report about:\n{input}\n\nInclude: executive summary, introduction, methodology, findings, analysis, conclusions, and recommendations.',
    outputSchema: { required: ['executiveSummary', 'introduction', 'findings', 'conclusions', 'recommendations'], type: 'report' },
  },
  memo: {
    systemPrompt: 'You are a memo writer. Generate clear and concise internal memos.',
    userPromptTemplate: 'Generate a memo regarding:\n{input}\n\nInclude: header (To, From, Date, Subject), body (purpose, context, action items), and signature.',
    outputSchema: { required: ['to', 'from', 'date', 'subject', 'body'], type: 'memo' },
  },
  essay: {
    systemPrompt: 'You are an academic essay writer. Generate well-argued essays with proper structure.',
    userPromptTemplate: 'Write an essay about:\n{input}\n\nInclude: title, introduction with thesis, body paragraphs with evidence, and conclusion.',
    outputSchema: { required: ['title', 'introduction', 'body', 'conclusion', 'references'], type: 'essay' },
  },
  'research-paper': {
    systemPrompt: 'You are a research paper writer. Generate comprehensive academic research papers.',
    userPromptTemplate: 'Write a research paper on:\n{input}\n\nInclude: abstract, introduction, literature review, methodology, results, discussion, conclusion, and references.',
    outputSchema: { required: ['abstract', 'introduction', 'methodology', 'results', 'discussion', 'references'], type: 'research-paper' },
  },
  thesis: {
    systemPrompt: 'You are a thesis writer. Generate structured academic theses.',
    userPromptTemplate: 'Write a thesis on:\n{input}\n\nInclude: abstract, introduction, literature review, methodology, results, discussion, conclusion, bibliography, and appendices.',
    outputSchema: { required: ['abstract', 'introduction', 'chapters', 'conclusion', 'bibliography'], type: 'thesis' },
  },
  summary: {
    systemPrompt: 'You are a text summarizer. Generate concise and accurate summaries.',
    userPromptTemplate: 'Summarize the following text:\n{input}\n\nKeep the key points, remove redundancy, and maintain logical flow.',
    outputSchema: { required: ['summary', 'keyPoints'], type: 'summary' },
  },
  nda: {
    systemPrompt: 'You are a legal document drafter. Generate precise non-disclosure agreements.',
    userPromptTemplate: 'Generate an NDA with:\n{input}\n\nInclude: parties, definition of confidential information, obligations, exclusions, term, and governing law.',
    outputSchema: { required: ['parties', 'confidentialInfo', 'obligations', 'term', 'governingLaw'], type: 'nda' },
  },
  agreement: {
    systemPrompt: 'You are a legal agreement drafter. Generate clear formal agreements.',
    userPromptTemplate: 'Generate a formal agreement:\n{input}\n\nInclude: parties, recitals, definitions, terms, obligations, representations, indemnification, and signatures.',
    outputSchema: { required: ['parties', 'terms', 'obligations', 'indemnification', 'signatures'], type: 'agreement' },
  },
  letter: {
    systemPrompt: 'You are a letter writer. Generate professional formal letters.',
    userPromptTemplate: 'Write a formal letter:\n{input}\n\nInclude: sender address, date, recipient address, salutation, body, closing, and signature block.',
    outputSchema: { required: ['sender', 'recipient', 'date', 'salutation', 'body', 'closing'], type: 'letter' },
  },
  resume: {
    systemPrompt: 'You are a resume writer. Generate professional resumes optimized for ATS.',
    userPromptTemplate: 'Create a resume for:\n{input}\n\nInclude: contact info, professional summary, skills, work experience with achievements, education, and certifications.',
    outputSchema: { required: ['contactInfo', 'summary', 'skills', 'experience', 'education'], type: 'resume' },
  },
  'cover-letter': {
    systemPrompt: 'You are a cover letter writer. Generate compelling and tailored cover letters.',
    userPromptTemplate: 'Write a cover letter for:\n{input}\n\nInclude: contact info, date, recipient, salutation, opening paragraph, body (skills/experience), closing, and signature.',
    outputSchema: { required: ['contactInfo', 'salutation', 'opening', 'body', 'closing'], type: 'cover-letter' },
  },
  cv: {
    systemPrompt: 'You are a CV writer. Generate comprehensive academic CVs.',
    userPromptTemplate: 'Create a CV for:\n{input}\n\nInclude: personal details, education, research experience, publications, presentations, teaching, awards, and references.',
    outputSchema: { required: ['personalDetails', 'education', 'research', 'publications', 'awards'], type: 'cv' },
  },
  story: {
    systemPrompt: 'You are a creative writer. Generate engaging short stories.',
    userPromptTemplate: 'Write a short story about:\n{input}\n\nInclude: title, setting, characters, plot with conflict, climax, and resolution.',
    outputSchema: { required: ['title', 'setting', 'characters', 'plot', 'resolution'], type: 'story' },
  },
  'blog-post': {
    systemPrompt: 'You are a blog writer. Generate engaging SEO-optimized blog posts.',
    userPromptTemplate: 'Write a blog post about:\n{input}\n\nInclude: catchy title, introduction hook, body with subheadings, conclusion with call to action, and meta description.',
    outputSchema: { required: ['title', 'introduction', 'body', 'conclusion', 'metaDescription'], type: 'blog-post' },
  },
  newsletter: {
    systemPrompt: 'You are a newsletter writer. Generate engaging email newsletters.',
    userPromptTemplate: 'Write a newsletter about:\n{input}\n\nInclude: subject line, greeting, main content sections, highlights, call to action, and footer with unsubscribe.',
    outputSchema: { required: ['subject', 'greeting', 'content', 'callToAction', 'footer'], type: 'newsletter' },
  },
};

export function getFormatPrompt(id: string): FormatPrompt | undefined {
  return FORMAT_PROMPTS[id];
}

export function applyPromptTemplate(template: string, input: string): string {
  return template.replace('{input}', input);
}