import { FileText } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const loremIpsumMeta: ToolMeta = {
  id: 'lorem-ipsum',
  title: 'Lorem Ipsum Generator',
  description: 'Generate placeholder text for design and development mockups',
  icon: FileText,
  path: '/tools/lorem-ipsum',
  category: 'generators',
  keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy', 'filler', 'lipsum'],
};
