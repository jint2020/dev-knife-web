/**
 * SVG Compressor Logic
 */

import { optimize } from 'svgo';

export interface CompressionOptions {
  removeDoctype: boolean;
  removeXMLProcInst: boolean;
  removeComments: boolean;
  removeMetadata: boolean;
  removeEditorsNSData: boolean;
  cleanupAttrs: boolean;
  inlineStyles: boolean;
  minifyStyles: boolean;
  convertStyleToAttrs: boolean;
  cleanupIds: boolean;
  removeUselessDefs: boolean;
  cleanupNumericValues: boolean;
  convertColors: boolean;
  removeUnknownsAndDefaults: boolean;
  removeNonInheritableGroupAttrs: boolean;
  removeUselessStrokeAndFill: boolean;
  removeViewBox: boolean;
  cleanupEnableBackground: boolean;
  removeHiddenElems: boolean;
  removeEmptyText: boolean;
  convertShapeToPath: boolean;
  moveElemsAttrsToGroup: boolean;
  moveGroupAttrsToElems: boolean;
  collapseGroups: boolean;
  convertPathData: boolean;
  convertTransform: boolean;
  removeEmptyAttrs: boolean;
  removeEmptyContainers: boolean;
  mergePaths: boolean;
  removeUnusedNS: boolean;
  sortAttrs: boolean;
  sortDefsChildren: boolean;
  removeTitle: boolean;
  removeDesc: boolean;
}

export interface CompressionResult {
  originalSvg: string;
  compressedSvg: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Default compression options
 */
export const DEFAULT_OPTIONS: CompressionOptions = {
  removeDoctype: true,
  removeXMLProcInst: true,
  removeComments: true,
  removeMetadata: true,
  removeEditorsNSData: true,
  cleanupAttrs: true,
  inlineStyles: true,
  minifyStyles: true,
  convertStyleToAttrs: true,
  cleanupIds: true,
  removeUselessDefs: true,
  cleanupNumericValues: true,
  convertColors: true,
  removeUnknownsAndDefaults: true,
  removeNonInheritableGroupAttrs: true,
  removeUselessStrokeAndFill: true,
  removeViewBox: false,
  cleanupEnableBackground: true,
  removeHiddenElems: true,
  removeEmptyText: true,
  convertShapeToPath: true,
  moveElemsAttrsToGroup: true,
  moveGroupAttrsToElems: true,
  collapseGroups: true,
  convertPathData: true,
  convertTransform: true,
  removeEmptyAttrs: true,
  removeEmptyContainers: true,
  mergePaths: true,
  removeUnusedNS: true,
  sortAttrs: false,
  sortDefsChildren: true,
  removeTitle: false,
  removeDesc: false,
};

/**
 * Compress SVG using SVGO
 */
export async function compressSVG(
  svgContent: string,
  options: CompressionOptions
): Promise<CompressionResult> {
  const originalSize = new Blob([svgContent]).size;

  try {
    const config = {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeDoctype: options.removeDoctype,
              removeXMLProcInst: options.removeXMLProcInst,
              removeComments: options.removeComments,
              removeMetadata: options.removeMetadata,
              removeEditorsNSData: options.removeEditorsNSData,
              cleanupAttrs: options.cleanupAttrs,
              inlineStyles: options.inlineStyles,
              minifyStyles: options.minifyStyles,
              cleanupIds: options.cleanupIds,
              removeUselessDefs: options.removeUselessDefs,
              cleanupNumericValues: options.cleanupNumericValues,
              convertColors: options.convertColors,
              removeUnknownsAndDefaults: options.removeUnknownsAndDefaults,
              removeNonInheritableGroupAttrs: options.removeNonInheritableGroupAttrs,
              removeUselessStrokeAndFill: options.removeUselessStrokeAndFill,
              removeViewBox: options.removeViewBox,
              cleanupEnableBackground: options.cleanupEnableBackground,
              removeHiddenElems: options.removeHiddenElems,
              removeEmptyText: options.removeEmptyText,
              convertShapeToPath: options.convertShapeToPath,
              moveElemsAttrsToGroup: options.moveElemsAttrsToGroup,
              moveGroupAttrsToElems: options.moveGroupAttrsToElems,
              collapseGroups: options.collapseGroups,
              convertPathData: options.convertPathData,
              convertTransform: options.convertTransform,
              removeEmptyAttrs: options.removeEmptyAttrs,
              removeEmptyContainers: options.removeEmptyContainers,
              mergePaths: options.mergePaths,
              removeUnusedNS: options.removeUnusedNS,
              sortAttrs: options.sortAttrs,
              sortDefsChildren: options.sortDefsChildren,
              removeTitle: options.removeTitle,
              removeDesc: options.removeDesc,
            },
          },
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = optimize(svgContent, config as any);
    const compressedSvg = result.data;
    const compressedSize = new Blob([compressedSvg]).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      originalSvg: svgContent,
      compressedSvg,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (err) {
    throw new Error('Failed to compress SVG: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

/**
 * Read file as text
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Download SVG file
 */
export function downloadSVG(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/\.svg$/, '_compressed.svg');
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Validate SVG content
 */
export function isValidSVG(content: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'image/svg+xml');
    const parserError = doc.querySelector('parsererror');
    return !parserError && doc.documentElement.tagName === 'svg';
  } catch {
    return false;
  }
}
