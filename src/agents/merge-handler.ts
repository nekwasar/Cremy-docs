export async function handleMerge(
  files: Array<{ name: string; content: string }>,
  order: string[]
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  try {
    const ordered = order.map((id) => files.find((f) => f.name === id || f.content === id)).filter(Boolean);

    if (ordered.length === 0) {
      return { success: false, error: 'No files to merge' };
    }

    const mergedContent = ordered.map((f) => f?.content || '').join('\n\n');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
