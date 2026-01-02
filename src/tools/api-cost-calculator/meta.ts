import type { ToolMeta } from '@/types/tool';
import { DollarSign } from 'lucide-react';

export const apiCostCalculatorMeta: ToolMeta = {
  id: 'api-cost-calculator',
  title: 'LLM Cost Calculator',
  locales: 'tools.apiCostCalculator',
  description: 'Calculate API costs for LLM usage',
  icon: DollarSign,
  path: '/tools/api-cost-calculator',
  category: 'text',
  keywords: ['llm', 'api', 'cost', 'calculator', 'pricing', 'openai', 'claude', 'gemini'],
};
