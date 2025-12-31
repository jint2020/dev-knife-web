import { FileCode } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const base64EncoderMeta: ToolMeta = {
  id: 'base64-encoder',
  title: 'Base64 Encoder/Decoder',
  locales: 'base64Encoder',
  description: 'Encode and decode Base64 strings and files',
  icon: FileCode,
  path: '/tools/base64-encoder',
  category: 'crypto',
  keywords: ['base64', 'encode', 'decode', 'binary', 'btoa', 'atob', 'text', 'image'],
};
