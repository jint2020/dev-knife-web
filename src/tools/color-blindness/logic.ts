/**
 * Color Blindness Simulator Logic
 * Using SVG filter matrices to simulate different types of color blindness
 */

export type ColorBlindnessType = 
  | 'normal'
  | 'protanopia'
  | 'protanomaly'
  | 'deuteranopia'
  | 'deuteranomaly'
  | 'tritanopia'
  | 'tritanomaly'
  | 'achromatopsia'
  | 'achromatomaly';

export interface ColorBlindnessInfo {
  type: ColorBlindnessType;
  name: string;
  description: string;
  prevalence: string;
  matrix: number[][];
}

/**
 * Color blindness filter matrices
 * These matrices transform RGB values to simulate different types of color blindness
 */
export const COLOR_BLINDNESS_FILTERS: Record<ColorBlindnessType, ColorBlindnessInfo> = {
  normal: {
    type: 'normal',
    name: 'Normal Vision',
    description: 'No color blindness - see all colors normally',
    prevalence: 'N/A',
    matrix: [
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  protanopia: {
    type: 'protanopia',
    name: 'Protanopia',
    description: 'Red-blind - missing red cones (severe)',
    prevalence: '~1% of males',
    matrix: [
      [0.567, 0.433, 0, 0, 0],
      [0.558, 0.442, 0, 0, 0],
      [0, 0.242, 0.758, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  protanomaly: {
    type: 'protanomaly',
    name: 'Protanomaly',
    description: 'Red-weak - reduced red sensitivity (mild)',
    prevalence: '~1% of males',
    matrix: [
      [0.817, 0.183, 0, 0, 0],
      [0.333, 0.667, 0, 0, 0],
      [0, 0.125, 0.875, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  deuteranopia: {
    type: 'deuteranopia',
    name: 'Deuteranopia',
    description: 'Green-blind - missing green cones (severe)',
    prevalence: '~1% of males',
    matrix: [
      [0.625, 0.375, 0, 0, 0],
      [0.7, 0.3, 0, 0, 0],
      [0, 0.3, 0.7, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  deuteranomaly: {
    type: 'deuteranomaly',
    name: 'Deuteranomaly',
    description: 'Green-weak - reduced green sensitivity (mild)',
    prevalence: '~5% of males',
    matrix: [
      [0.8, 0.2, 0, 0, 0],
      [0.258, 0.742, 0, 0, 0],
      [0, 0.142, 0.858, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  tritanopia: {
    type: 'tritanopia',
    name: 'Tritanopia',
    description: 'Blue-blind - missing blue cones (severe)',
    prevalence: '~0.001% of population',
    matrix: [
      [0.95, 0.05, 0, 0, 0],
      [0, 0.433, 0.567, 0, 0],
      [0, 0.475, 0.525, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  tritanomaly: {
    type: 'tritanomaly',
    name: 'Tritanomaly',
    description: 'Blue-weak - reduced blue sensitivity (mild)',
    prevalence: '~0.01% of population',
    matrix: [
      [0.967, 0.033, 0, 0, 0],
      [0, 0.733, 0.267, 0, 0],
      [0, 0.183, 0.817, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  achromatopsia: {
    type: 'achromatopsia',
    name: 'Achromatopsia',
    description: 'Total color blindness - see only grayscale',
    prevalence: '~0.003% of population',
    matrix: [
      [0.299, 0.587, 0.114, 0, 0],
      [0.299, 0.587, 0.114, 0, 0],
      [0.299, 0.587, 0.114, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  achromatomaly: {
    type: 'achromatomaly',
    name: 'Achromatomaly',
    description: 'Partial color blindness - reduced color perception',
    prevalence: 'Very rare',
    matrix: [
      [0.618, 0.320, 0.062, 0, 0],
      [0.163, 0.775, 0.062, 0, 0],
      [0.163, 0.320, 0.516, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
};

/**
 * Generate SVG filter string for color blindness simulation
 */
export function generateSVGFilter(type: ColorBlindnessType): string {
  const info = COLOR_BLINDNESS_FILTERS[type];
  const matrix = info.matrix.flat().join(' ');
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 0; height: 0;">
      <defs>
        <filter id="colorblind-${type}">
          <feColorMatrix type="matrix" values="${matrix}" />
        </filter>
      </defs>
    </svg>
  `;
}

/**
 * Apply color blindness filter to canvas
 */
export async function applyColorBlindnessFilter(
  file: File,
  type: ColorBlindnessType
): Promise<string> {
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

        // Draw original image
        ctx.drawImage(img, 0, 0);

        if (type === 'normal') {
          resolve(canvas.toDataURL());
          return;
        }

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const matrix = COLOR_BLINDNESS_FILTERS[type].matrix;

        // Apply color matrix transformation
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2];
          data[i + 1] = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2];
          data[i + 2] = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2];
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
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
 * Download image with filter applied
 */
export function downloadFilteredImage(dataUrl: string, originalFilename: string, filterType: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  
  const nameWithoutExt = originalFilename.replace(/\.[^.]+$/, '');
  link.download = `${nameWithoutExt}_${filterType}.png`;
  
  link.click();
}
