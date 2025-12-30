import { Hash } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const hashGeneratorMeta: ToolMeta = {
  id: 'hash-generator',
  title: 'Hash Generator',
  description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes for text and files',
  icon: Hash,
  path: '/tools/hash-generator',
  category: 'crypto',
  keywords: ['hash', 'md5', 'sha', 'sha1', 'sha256', 'sha512', 'checksum', 'digest', 'crypto'],
};
