import type { ToolMeta } from '@/types/tool';
import { Hash } from 'lucide-react';

export const tokenCounterMeta: ToolMeta = {
  id: 'token-counter',
  title: 'Token Counter',
  locales: 'tokenCounter',
  description: 'Count tokens and characters for LLM prompts',
  icon: Hash,
  path: '/tools/token-counter',
  category: 'ai',
  keywords: ['token', 'counter', 'llm', 'gpt', 'claude', 'prompt', 'tokenizer'],
};
