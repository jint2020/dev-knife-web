import { Key } from 'lucide-react';
import type { ToolMeta } from '@/types/tool';

export const passwordGeneratorMeta: ToolMeta = {
  id: 'password-generator',
  title: 'Password Generator',
  locales: 'passwordGenerator',
  description: 'Generate secure random passwords with customizable options',
  icon: Key,
  path: '/tools/password-generator',
  category: 'generators',
  keywords: ['password', 'generator', 'secure', 'random', 'strong', 'passphrase'],
};
