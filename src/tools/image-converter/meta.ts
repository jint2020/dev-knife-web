import { Image as ImageIcon } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const imageConverterMeta: ToolMeta = {
  id: 'image-converter',
  title: 'Image Converter',
  locales: 'imageConverter',
  description: 'Convert images between PNG, JPG, and WebP formats',
  icon: ImageIcon,
  path: '/tools/image-converter',
  category: 'image',
  keywords: ['image', 'convert', 'png', 'jpg', 'jpeg', 'webp', 'format'],
};
