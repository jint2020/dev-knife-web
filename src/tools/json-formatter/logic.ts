/**
 * JSON Formatter Logic
 */

export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  parsed?: unknown;
}

/**
 * Validate JSON string
 */
export function validateJson(input: string): JsonValidationResult {
  if (!input.trim()) {
    return { valid: false, error: 'Empty input' };
  }

  try {
    const parsed = JSON.parse(input);
    return { valid: true, parsed };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    return { valid: false, error: errorMessage };
  }
}

/**
 * Format JSON with indentation
 */
export function formatJson(input: string, indent: number = 2): string {
  const validation = validateJson(input);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  return JSON.stringify(validation.parsed, null, indent);
}

/**
 * Minify JSON (remove whitespace)
 */
export function minifyJson(input: string): string {
  const validation = validateJson(input);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  return JSON.stringify(validation.parsed);
}

/**
 * Sort JSON keys alphabetically
 */
export function sortJsonKeys(input: string, indent: number = 2): string {
  const validation = validateJson(input);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const sortObject = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(sortObject);
    }
    if (obj !== null && typeof obj === 'object') {
      const typedObj = obj as Record<string, unknown>;
      return Object.keys(typedObj)
        .sort()
        .reduce((result, key) => {
          result[key] = sortObject(typedObj[key]);
          return result;
        }, {} as Record<string, unknown>);
    }
    return obj;
  };

  const sorted = sortObject(validation.parsed);
  return JSON.stringify(sorted, null, indent);
}

/**
 * Escape JSON string for use in other contexts
 */
export function escapeJson(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Get JSON statistics
 */
export function getJsonStats(input: string): {
  size: number;
  lines: number;
  depth: number;
  keys: number;
  values: number;
} | null {
  const validation = validateJson(input);
  if (!validation.valid) return null;

  const countDepth = (obj: unknown, currentDepth: number = 1): number => {
    if (obj === null || typeof obj !== 'object') return currentDepth;
    
    const depths = Object.values(obj).map(value => 
      countDepth(value, currentDepth + 1)
    );
    return Math.max(currentDepth, ...depths);
  };

  const countKeys = (obj: unknown): number => {
    if (obj === null || typeof obj !== 'object') return 0;
    let count = Object.keys(obj).length;
    for (const value of Object.values(obj)) {
      count += countKeys(value);
    }
    return count;
  };

  const countValues = (obj: unknown): number => {
    if (obj === null || typeof obj !== 'object') return 1;
    let count = 0;
    for (const value of Object.values(obj)) {
      count += countValues(value);
    }
    return count;
  };

  return {
    size: input.length,
    lines: input.split('\n').length,
    depth: countDepth(validation.parsed),
    keys: countKeys(validation.parsed),
    values: countValues(validation.parsed),
  };
}
