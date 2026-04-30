export async function checkIndexedPages(): Promise<{
  indexed: number;
  total: number;
}> {
  return { indexed: 0, total: 200 };
}

export async function checkBrokenLinks(): Promise<string[]> {
  return [];
}

export async function generateSEOReport(): Promise<{
  indexed: number;
  total: number;
  brokenLinks: string[];
  generatedAt: Date;
}> {
  return {
    indexed: 0,
    total: 200,
    brokenLinks: [],
    generatedAt: new Date(),
  };
}
