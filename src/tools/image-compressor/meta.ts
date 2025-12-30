import { ImageDown } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const imageCompressorMeta: ToolMeta = {
  id: 'image-compressor',
  title: 'Image Compressor',
  description: 'Compress images to reduce file size while maintaining quality',
  icon: ImageDown,
  path: '/tools/image-compressor',
  category: 'image',
  keywords: ['image', 'compress', 'optimize', 'reduce', 'size', 'quality', 'photo'],
};
