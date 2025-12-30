import { Type } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const caseConverterMeta: ToolMeta = {
  id: 'case-converter',
  title: 'Case Converter',
  description: 'Convert text between different cases: upper, lower, title, camel, snake, etc.',
  icon: Type,
  path: '/tools/case-converter',
  category: 'text',
  keywords: ['case', 'convert', 'uppercase', 'lowercase', 'camel', 'snake', 'kebab', 'title', 'pascal'],
};
