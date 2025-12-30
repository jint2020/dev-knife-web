/**
 * Case Converter Logic
 */

/**
 * Convert to UPPERCASE
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

/**
 * Convert to lowercase
 */
export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

/**
 * Convert to Title Case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert to Sentence case
 */
export function toSentenceCase(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert to camelCase
 */
export function toCamelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Convert to PascalCase
 */
export function toPascalCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Convert to snake_case
 */
export function toSnakeCase(text: string): string {
  return text
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^_+/, '')
    .replace(/_+/g, '_');
}

/**
 * Convert to kebab-case
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+/, '')
    .replace(/-+/g, '-');
}

/**
 * Convert to CONSTANT_CASE
 */
export function toConstantCase(text: string): string {
  return toSnakeCase(text).toUpperCase();
}

/**
 * Convert to dot.case
 */
export function toDotCase(text: string): string {
  return text
    .replace(/([A-Z])/g, '.$1')
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '')
    .replace(/^\.+/, '')
    .replace(/\.+/g, '.');
}

/**
 * InVeRt CaSe
 */
export function toInvertCase(text: string): string {
  return text
    .split('')
    .map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    })
    .join('');
}

/**
 * aLtErNaTiNg cAsE
 */
export function toAlternatingCase(text: string): string {
  return text
    .split('')
    .map((char, index) => {
      if (index % 2 === 0) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    })
    .join('');
}
