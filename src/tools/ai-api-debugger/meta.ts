import type { ToolMeta } from '@/types/tool';
import { MessageSquare } from 'lucide-react';

export const aiApiDebuggerMeta: ToolMeta = {
  id: 'ai-api-debugger',
  title: 'AI API Playground',
  locales: 'tools.aiApiDebugger',
  description: 'Test and debug AI API requests directly from browser',
  icon: MessageSquare,
  path: '/tools/ai-api-debugger',
  category: 'text',
  keywords: ['ai', 'api', 'playground', 'debugger', 'openai', 'claude', 'test', 'chat'],
};
