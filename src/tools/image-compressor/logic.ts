/**
 * Image Compressor Logic
 */

import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  quality: number;
  fileType?: string;
}

export interface CompressionResult {
  originalFile: File;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalUrl: string;
  compressedUrl: string;
}

/**
 * Compress an image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const compressionOptions = {
    maxSizeMB: options.maxSizeMB,
    maxWidthOrHeight: options.maxWidthOrHeight,
    useWebWorker: options.useWebWorker,
    initialQuality: options.quality,
    fileType: options.fileType,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    
    const originalUrl = URL.createObjectURL(file);
    const compressedUrl = URL.createObjectURL(compressedFile);
    
    const originalSize = file.size;
    const compressedSize = compressedFile.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      originalFile: file,
      compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
      originalUrl,
      compressedUrl,
    };
  } catch (err) {
    throw new Error('Failed to compress image: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Download compressed image
 */
export function downloadImage(file: File, filename: string): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
