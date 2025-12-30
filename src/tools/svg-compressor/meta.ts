import { FileCode } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const svgCompressorMeta: ToolMeta = {
  id: 'svg-compressor',
  title: 'SVG Compressor',
  description: 'Optimize and compress SVG files to reduce file size',
  icon: FileCode,
  path: '/tools/svg-compressor',
  category: 'image',
  keywords: ['svg', 'compress', 'optimize', 'minify', 'vector', 'svgo'],
};
