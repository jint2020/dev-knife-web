import { FileText } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const textDiffMeta: ToolMeta = {
  id: 'text-diff',
  title: 'Text Diff Viewer',
  description: 'Compare and visualize differences between two text blocks',
  icon: FileText,
  path: '/tools/text-diff',
  category: 'text',
  keywords: ['diff', 'compare', 'text', 'difference', 'changes', 'merge', 'patch'],
};
