import { Eye } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const colorBlindnessMeta: ToolMeta = {
  id: 'color-blindness',
  title: 'Color Blindness Simulator',
  description: 'Simulate how images appear to people with different types of color blindness',
  icon: Eye,
  path: '/tools/color-blindness',
  category: 'image',
  keywords: ['color', 'blindness', 'accessibility', 'vision', 'simulate', 'daltonism'],
};
