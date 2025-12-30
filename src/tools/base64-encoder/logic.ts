/**
 * Base64 Encoder/Decoder Logic
 */

/**
 * Encode text to Base64
 */
export function encodeBase64(input: string): string {
  try {
    // Use btoa for ASCII strings
    return btoa(input);
  } catch {
    // For Unicode strings, use TextEncoder
    const bytes = new TextEncoder().encode(input);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
    return btoa(binString);
  }
}

/**
 * Decode Base64 to text
 */
export function decodeBase64(input: string): string {
  try {
    // Remove whitespace and validate Base64
    const cleaned = input.replace(/\s/g, '');
    const decoded = atob(cleaned);
    
    // Try to decode as UTF-8
    try {
      const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      // If UTF-8 decode fails, return as-is
      return decoded;
    }
  } catch {
    throw new Error('Invalid Base64 string');
  }
}

/**
 * Encode file to Base64
 */
export function encodeFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate Base64 string
 */
export function isValidBase64(str: string): boolean {
  try {
    const cleaned = str.replace(/\s/g, '');
    return btoa(atob(cleaned)) === cleaned;
  } catch {
    return false;
  }
}

/**
 * Get file info from Base64 data URL
 */
export function getBase64FileInfo(dataUrl: string): {
  mimeType: string;
  base64: string;
} | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  
  return {
    mimeType: match[1],
    base64: match[2],
  };
}
