import { Braces } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const jsonFormatterMeta: ToolMeta = {
  id: 'json-formatter',
  title: 'JSON Formatter',
  description: 'Format, validate, and minify JSON with syntax highlighting',
  icon: Braces,
  path: '/tools/json-formatter',
  category: 'formatters',
  keywords: ['json', 'format', 'pretty', 'minify', 'validate', 'parse', 'beautify', 'compact'],
};
