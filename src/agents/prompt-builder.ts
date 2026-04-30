export function buildIntentPrompt(message: string): string {
  return `Analyze the user's message and determine their intent regarding document operations. 

User message: "${message}"

Determine:
1. What is the primary goal? (generate, edit, convert, translate, voice, extract, merge, split, compress, change_style)
2. What file format is involved?
3. What is the desired output?
4. Confidence level (0-1)

Return structured JSON.`;
}

export function buildToolSelectionPrompt(
  intent: string,
  page: string,
  availableTools: string[]
): string {
  return `The user wants to ${intent}. Current page: ${page}. Available tools: ${availableTools.join(', ')}.

Select the most appropriate tool. Return structured JSON with tool ID and reasoning.`;
}

export function buildClarificationPrompt(
  message: string,
  possibleIntents: string[]
): string {
  return `The user message "${message}" could mean multiple things. Possible interpretations: ${possibleIntents.join(', ')}.

Formulate a clear, helpful clarification question and generate clickable options for each interpretation.`;
}

export function buildExecutionPrompt(
  tool: string,
  input: string,
  context?: string
): string {
  let prompt = `Execute the "${tool}" operation. Input: ${input}`;
  if (context) prompt += `\nContext: ${context}`;
  return prompt;
}

export function buildSystemPrompt(page: string): string {
  return `You are Cremy Docs Agent — an intelligent document assistant. 

Current page: ${page}
You help users create, edit, convert, translate, extract, merge, split, compress, and change the style of documents.

Rules:
- Only handle document-related tasks. Reject coding, weather, and non-document requests.
- If ambiguous, ask clarifying questions with clickable options.
- Always consider credit costs before executing paid tools.
- Know which tools are available on the current page.
- Be concise and helpful.`;
}
