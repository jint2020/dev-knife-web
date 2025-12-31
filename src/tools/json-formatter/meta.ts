/*
 * @Description: 
 * @Author: Jin Tang
 * @Date: 2025-12-30 10:39:57
 * @LastEditors: Jin Tang
 * @LastEditTime: 2025-12-31 09:45:05
 */
import { Braces } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const jsonFormatterMeta: ToolMeta = {
  id: 'json-formatter',
  title: 'JSON Formatter',
  locales: 'jsonFormatter',
  description: 'Format, validate, and minify JSON with syntax highlighting',
  icon: Braces,
  path: '/tools/json-formatter',
  category: 'formatters',
  keywords: ['json', 'format', 'pretty', 'minify', 'validate', 'parse', 'beautify', 'compact'],
};
