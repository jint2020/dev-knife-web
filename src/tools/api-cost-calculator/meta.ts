import type { ToolMeta } from '@/types/tool';
import { DollarSign } from 'lucide-react';

export const apiCostCalculatorMeta: ToolMeta = {
  id: 'api-cost-calculator',
  title: 'Smart LLM Cost Estimator',
  locales: 'apiCostCalculator',
  description: 'Estimate LLM API costs with token counting and custom models',
  icon: DollarSign,
  path: '/tools/api-cost-calculator',
  category: 'ai',
  keywords: [
    'llm',
    'api',
    'cost',
    'calculator',
    'pricing',
    'estimator',
    'token',
    'openai',
    'claude',
    'gemini',
    'deepseek',
    'gpt',
    'ai',
    'usage',
    'projection',
  ],
};
