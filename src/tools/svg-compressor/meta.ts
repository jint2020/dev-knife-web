/*
 * @Description: 
 * @Author: Jin Tang
 * @Date: 2025-12-30 11:06:02
 * @LastEditors: Jin Tang
 * @LastEditTime: 2025-12-31 09:46:39
 */
import { FileCode } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const svgCompressorMeta: ToolMeta = {
  id: 'svg-compressor',
  title: 'SVG Compressor',
  locales: 'svgCompressor',
  description: 'Optimize and compress SVG files to reduce file size',
  icon: FileCode,
  path: '/tools/svg-compressor',
  category: 'image',
  keywords: ['svg', 'compress', 'optimize', 'minify', 'vector', 'svgo'],
};
