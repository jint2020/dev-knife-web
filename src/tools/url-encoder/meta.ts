import { Link } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const urlEncoderMeta: ToolMeta = {
  id: 'url-encoder',
  title: 'URL Encoder/Decoder',
  locales: 'urlEncoder',
  description: 'Encode and decode URLs with support for query parameters',
  icon: Link,
  path: '/tools/url-encoder',
  category: 'crypto',
  keywords: ['url', 'encode', 'decode', 'percent', 'uri', 'query', 'parameter'],
};
