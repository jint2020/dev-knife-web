import { Fingerprint } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const uuidGeneratorMeta: ToolMeta = {
  id: 'uuid-generator',
  title: 'UUID Generator',
  description: 'Generate random UUIDs (v4) for unique identifiers',
  icon: Fingerprint,
  path: '/tools/uuid-generator',
  category: 'generators',
  keywords: ['uuid', 'guid', 'unique', 'identifier', 'random', 'generator', 'v4'],
};
