let counter = 0;

export function generateElementId(prefix: string = 'el'): string {
  counter++;
  return `${prefix}-${counter}-${Date.now().toString(36)}`;
}

export function resetElementIds(): void {
  counter = 0;
}

export function createElementIdMap(elements: { id: string; type: string }[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const el of elements) {
    map.set(el.id || generateElementId(el.type), el.type);
  }
  return map;
}