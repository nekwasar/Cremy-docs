interface ElementContext {
  elementId: string;
  elementType: string;
  elementContent: string;
  surroundingElements: Array<{
    id: string;
    type: string;
    content: string;
    position: 'before' | 'after';
  }>;
  fullDocument: string;
}

export function buildElementContext(
  elementId: string,
  elementType: string,
  elementContent: string,
  allElements: Array<{ id: string; type: string; content: string }>,
  fullContent: string
): ElementContext {
  const targetIndex = allElements.findIndex((el) => el.id === elementId);

  const surroundingElements: ElementContext['surroundingElements'] = [];

  if (targetIndex > 0) {
    surroundingElements.push({
      id: allElements[targetIndex - 1].id,
      type: allElements[targetIndex - 1].type,
      content: allElements[targetIndex - 1].content.slice(0, 500),
      position: 'before',
    });
  }

  if (targetIndex < allElements.length - 1) {
    surroundingElements.push({
      id: allElements[targetIndex + 1].id,
      type: allElements[targetIndex + 1].type,
      content: allElements[targetIndex + 1].content.slice(0, 500),
      position: 'after',
    });
  }

  return {
    elementId,
    elementType,
    elementContent,
    surroundingElements,
    fullDocument: fullContent,
  };
}

export function buildElementEditPrompt(
  context: ElementContext,
  instruction: string
): string {
  let prompt = `Edit the following ${context.elementType} element:\n\n`;
  prompt += `Element content:\n${context.elementContent}\n\n`;

  if (context.surroundingElements.length > 0) {
    prompt += 'Surrounding context:\n';
    for (const el of context.surroundingElements) {
      prompt += `${el.position.toUpperCase()}: [${el.type}] ${el.content.slice(0, 200)}\n`;
    }
    prompt += '\n';
  }

  prompt += `Edit instruction: ${instruction}\n\n`;
  prompt += 'Return ONLY the edited element content. Do not modify surrounding elements.';

  return prompt;
}