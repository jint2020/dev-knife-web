/**
 * URL Encoder/Decoder Logic
 */

export interface UrlParseResult {
  protocol: string;
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
  params: Record<string, string>;
}

/**
 * Encode a URL component using encodeURIComponent
 */
export function encodeUrl(text: string): string {
  return encodeURIComponent(text);
}

/**
 * Decode a URL component using decodeURIComponent
 */
export function decodeUrl(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    throw new Error('Invalid URL encoding');
  }
}

/**
 * Encode a full URL
 */
export function encodeFullUrl(text: string): string {
  return encodeURI(text);
}

/**
 * Decode a full URL
 */
export function decodeFullUrl(text: string): string {
  try {
    return decodeURI(text);
  } catch {
    throw new Error('Invalid URL encoding');
  }
}

/**
 * Parse URL and extract components
 */
export function parseUrl(urlString: string): UrlParseResult | null {
  try {
    const url = new URL(urlString);
    const params: Record<string, string> = {};
    
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return {
      protocol: url.protocol,
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      params,
    };
  } catch {
    return null;
  }
}

/**
 * Build URL from components
 */
export function buildUrl(
  base: string,
  params: Record<string, string>
): string {
  try {
    const url = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  } catch {
    throw new Error('Invalid base URL');
  }
}

/**
 * Extract query parameters from URL string
 */
export function extractParams(urlString: string): Record<string, string> {
  const parsed = parseUrl(urlString);
  return parsed ? parsed.params : {};
}

/**
 * Check if string is a valid URL
 */
export function isValidUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}
