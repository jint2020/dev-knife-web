/**
 * UUID Generator Logic
 * Pure business logic for generating UUIDs (v4)
 */

/**
 * Generate a random UUID v4
 * Uses crypto.randomUUID() if available, falls back to polyfill
 */
export function generateUUID(): string {
  // Modern browsers support crypto.randomUUID()
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback polyfill for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate multiple UUIDs
 */
export function generateBulkUUIDs(count: number): string[] {
  return Array.from({ length: count }, () => generateUUID());
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
