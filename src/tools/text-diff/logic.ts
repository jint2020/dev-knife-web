/**
 * Text Diff Logic
 */

import * as Diff from 'diff';

export type DiffMode = 'chars' | 'words' | 'lines';

export interface DiffResult {
  value: string;
  added?: boolean;
  removed?: boolean;
  count?: number;
}

/**
 * Compare two texts and return differences
 */
export function compareText(
  text1: string,
  text2: string,
  mode: DiffMode = 'lines'
): DiffResult[] {
  switch (mode) {
    case 'chars':
      return Diff.diffChars(text1, text2);
    case 'words':
      return Diff.diffWords(text1, text2);
    case 'lines':
      return Diff.diffLines(text1, text2);
    default:
      return Diff.diffLines(text1, text2);
  }
}

/**
 * Get statistics about the diff
 */
export function getDiffStats(diff: DiffResult[]): {
  added: number;
  removed: number;
  unchanged: number;
  total: number;
} {
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  diff.forEach((part) => {
    const count = part.count || 0;
    if (part.added) {
      added += count;
    } else if (part.removed) {
      removed += count;
    } else {
      unchanged += count;
    }
  });

  return {
    added,
    removed,
    unchanged,
    total: added + removed + unchanged,
  };
}

/**
 * Generate unified diff format
 */
export function generateUnifiedDiff(
  text1: string,
  text2: string,
  filename1: string = 'original',
  filename2: string = 'modified'
): string {
  return Diff.createPatch(filename1, text1, text2, filename1, filename2);
}

/**
 * Format diff for display
 */
export function formatDiff(diff: DiffResult[]): string {
  return diff
    .map((part) => {
      const prefix = part.added ? '+' : part.removed ? '-' : ' ';
      return part.value.split('\n').map(line => prefix + line).join('\n');
    })
    .join('');
}
