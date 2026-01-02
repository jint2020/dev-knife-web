import type { ToolMeta } from '@/types/tool';
import { Hash } from 'lucide-react';

export const tokenCounterMeta: ToolMeta = {
  id: 'token-counter',
  title: 'Token Counter',
  locales: 'tools.tokenCounter',
  description: 'Count tokens and characters for LLM prompts',
  icon: Hash,
  path: '/tools/token-counter',
  category: 'text',
  keywords: ['token', 'counter', 'llm', 'gpt', 'claude', 'prompt', 'tokenizer'],
};
