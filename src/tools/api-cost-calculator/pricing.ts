/**
 * LLM API pricing data (per 1M tokens)
 * Prices are in USD and updated as of January 2025
 */

export interface ModelPricing {
  id: string;
  provider: string;
  name: string;
  inputPrice: number;  // USD per 1M input tokens
  outputPrice: number; // USD per 1M output tokens
}

export const MODEL_PRICING: ModelPricing[] = [
  // OpenAI
  {
    id: 'gpt-4o',
    provider: 'OpenAI',
    name: 'GPT-4o',
    inputPrice: 2.5,
    outputPrice: 10.0,
  },
  {
    id: 'gpt-4o-mini',
    provider: 'OpenAI',
    name: 'GPT-4o Mini',
    inputPrice: 0.15,
    outputPrice: 0.6,
  },
  {
    id: 'gpt-4-turbo',
    provider: 'OpenAI',
    name: 'GPT-4 Turbo',
    inputPrice: 10.0,
    outputPrice: 30.0,
  },
  {
    id: 'gpt-3.5-turbo',
    provider: 'OpenAI',
    name: 'GPT-3.5 Turbo',
    inputPrice: 0.5,
    outputPrice: 1.5,
  },

  // Anthropic Claude
  {
    id: 'claude-3.5-sonnet',
    provider: 'Anthropic',
    name: 'Claude 3.5 Sonnet',
    inputPrice: 3.0,
    outputPrice: 15.0,
  },
  {
    id: 'claude-3.5-haiku',
    provider: 'Anthropic',
    name: 'Claude 3.5 Haiku',
    inputPrice: 0.8,
    outputPrice: 4.0,
  },
  {
    id: 'claude-3-opus',
    provider: 'Anthropic',
    name: 'Claude 3 Opus',
    inputPrice: 15.0,
    outputPrice: 75.0,
  },

  // DeepSeek
  {
    id: 'deepseek-chat',
    provider: 'DeepSeek',
    name: 'DeepSeek Chat',
    inputPrice: 0.14,
    outputPrice: 0.28,
  },
  {
    id: 'deepseek-reasoner',
    provider: 'DeepSeek',
    name: 'DeepSeek Reasoner',
    inputPrice: 0.55,
    outputPrice: 2.19,
  },

  // Google Gemini
  {
    id: 'gemini-2.0-flash',
    provider: 'Google',
    name: 'Gemini 2.0 Flash',
    inputPrice: 0.075,
    outputPrice: 0.3,
  },
  {
    id: 'gemini-1.5-pro',
    provider: 'Google',
    name: 'Gemini 1.5 Pro',
    inputPrice: 1.25,
    outputPrice: 5.0,
  },
  {
    id: 'gemini-1.5-flash',
    provider: 'Google',
    name: 'Gemini 1.5 Flash',
    inputPrice: 0.075,
    outputPrice: 0.3,
  },
];
