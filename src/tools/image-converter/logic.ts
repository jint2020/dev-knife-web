/**
 * Image Converter Logic
 */

export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export interface ConversionResult {
  originalFile: File;
  convertedBlob: Blob;
  originalFormat: string;
  targetFormat: string;
  originalSize: number;
  convertedSize: number;
  originalUrl: string;
  convertedUrl: string;
}

/**
 * Convert image to specified format
 */
export async function convertImage(
  file: File,
  targetFormat: ImageFormat,
  quality: number = 0.92
): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // For JPG format, fill with white background (JPG doesn't support transparency)
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image'));
              return;
            }

            const originalUrl = URL.createObjectURL(file);
            const convertedUrl = URL.createObjectURL(blob);

            resolve({
              originalFile: file,
              convertedBlob: blob,
              originalFormat: file.type,
              targetFormat,
              originalSize: file.size,
              convertedSize: blob.size,
              originalUrl,
              convertedUrl,
            });
          },
          targetFormat,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get format display name
 */
export function getFormatName(mimeType: string): string {
  const map: Record<string, string> = {
    'image/png': 'PNG',
    'image/jpeg': 'JPG',
    'image/jpg': 'JPG',
    'image/webp': 'WebP',
  };
  return map[mimeType] || mimeType;
}

/**
 * Get file extension from format
 */
export function getFileExtension(format: ImageFormat): string {
  const map: Record<ImageFormat, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
  };
  return map[format];
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
 * Download converted image
 */
export function downloadImage(blob: Blob, originalFilename: string, format: ImageFormat): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Replace original extension with new one
  const nameWithoutExt = originalFilename.replace(/\.[^.]+$/, '');
  link.download = nameWithoutExt + getFileExtension(format);
  
  link.click();
  URL.revokeObjectURL(url);
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
