export async function handleSplit(
  pages: number[],
  groups: number[][]
): Promise<{ success: boolean; error?: string }> {
  if (groups.length === 0 || !groups.every((g) => g.length > 0)) {
    return { success: false, error: 'Invalid split configuration' };
  }

  return { success: true };
}
