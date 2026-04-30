export function compareVersions(
  oldContent: string,
  newContent: string
): { added: string[]; removed: string[]; unchanged: number } {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  const added: string[] = [];
  const removed: string[] = [];
  let unchanged = 0;

  const maxLen = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined && newLine !== undefined) {
      added.push(newLine);
    } else if (newLine === undefined && oldLine !== undefined) {
      removed.push(oldLine);
    } else if (oldLine !== newLine) {
      removed.push(oldLine);
      added.push(newLine);
    } else {
      unchanged++;
    }
  }

  return { added, removed, unchanged };
}

export function getVersionDiffSummary(diff: { added: string[]; removed: string[]; unchanged: number }): string {
  const total = diff.added.length + diff.removed.length + diff.unchanged;
  const changed = diff.added.length + diff.removed.length;
  return `${changed} lines changed, ${diff.added.length} added, ${diff.removed.length} removed, ${diff.unchanged} unchanged (${total} total)`;
}
