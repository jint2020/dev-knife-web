/**
 * QR Code Generator Logic
 */

import QRCode from 'qrcode';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCodeOptions {
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  width: number;
  darkColor: string;
  lightColor: string;
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(
  text: string,
  options: QRCodeOptions
): Promise<string> {
  if (!text) {
    throw new Error('Text cannot be empty');
  }

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: options.width,
      color: {
        dark: options.darkColor,
        light: options.lightColor,
      },
    });
    return dataUrl;
  } catch (err) {
    throw new Error('Failed to generate QR code: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  text: string,
  options: QRCodeOptions
): Promise<string> {
  if (!text) {
    throw new Error('Text cannot be empty');
  }

  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: options.width,
      color: {
        dark: options.darkColor,
        light: options.lightColor,
      },
    });
    return svg;
  } catch (err) {
    throw new Error('Failed to generate QR code SVG: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

/**
 * Download QR code as PNG
 */
export function downloadQRCode(dataUrl: string, filename: string = 'qrcode.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

/**
 * Download QR code as SVG
 */
export function downloadQRCodeSVG(svg: string, filename: string = 'qrcode.svg'): void {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Get QR code capacity information
 */
export function getQRCodeCapacity(errorCorrectionLevel: ErrorCorrectionLevel): {
  numeric: number;
  alphanumeric: number;
  binary: number;
} {
  // These are approximate maximum capacities for version 40 QR codes
  const capacities = {
    L: { numeric: 7089, alphanumeric: 4296, binary: 2953 },
    M: { numeric: 5596, alphanumeric: 3391, binary: 2331 },
    Q: { numeric: 3993, alphanumeric: 2420, binary: 1663 },
    H: { numeric: 3057, alphanumeric: 1852, binary: 1273 },
  };

  return capacities[errorCorrectionLevel];
}
