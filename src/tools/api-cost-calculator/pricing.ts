/**
 * LLM API pricing data (per 1M tokens)
 * Prices are in USD and updated as of January 2025
 */

export interface ModelPricing {
  id: string;
  provider: string;
  name: string;
  inputPrice: number; // USD per 1M input tokens
  outputPrice: number; // USD per 1M output tokens
  contextWindow?: number; // Context window size in tokens
  isCustom?: boolean; // Flag to indicate if this is a user-defined model
  priceOverride?: {
    inputPrice?: number;
    outputPrice?: number;
  }; // Temporary price override
}

export const DEFAULT_MODEL_PRICING: ModelPricing[] = [
  // OpenAI
  {
    id: 'gpt-4o',
    provider: 'OpenAI',
    name: 'GPT-4o',
    inputPrice: 2.5,
    outputPrice: 10.0,
    contextWindow: 128000,
  },
  {
    id: 'gpt-4o-mini',
    provider: 'OpenAI',
    name: 'GPT-4o Mini',
    inputPrice: 0.15,
    outputPrice: 0.6,
    contextWindow: 128000,
  },
  {
    id: 'gpt-4-turbo',
    provider: 'OpenAI',
    name: 'GPT-4 Turbo',
    inputPrice: 10.0,
    outputPrice: 30.0,
    contextWindow: 128000,
  },
  {
    id: 'gpt-3.5-turbo',
    provider: 'OpenAI',
    name: 'GPT-3.5 Turbo',
    inputPrice: 0.5,
    outputPrice: 1.5,
    contextWindow: 16385,
  },

  // Anthropic Claude
  {
    id: 'claude-3.5-sonnet',
    provider: 'Anthropic',
    name: 'Claude 3.5 Sonnet',
    inputPrice: 3.0,
    outputPrice: 15.0,
    contextWindow: 200000,
  },
  {
    id: 'claude-3.5-haiku',
    provider: 'Anthropic',
    name: 'Claude 3.5 Haiku',
    inputPrice: 0.8,
    outputPrice: 4.0,
    contextWindow: 200000,
  },
  {
    id: 'claude-3-opus',
    provider: 'Anthropic',
    name: 'Claude 3 Opus',
    inputPrice: 15.0,
    outputPrice: 75.0,
    contextWindow: 200000,
  },

  // DeepSeek
  {
    id: 'deepseek-chat',
    provider: 'DeepSeek',
    name: 'DeepSeek Chat',
    inputPrice: 0.14,
    outputPrice: 0.28,
    contextWindow: 64000,
  },
  {
    id: 'deepseek-reasoner',
    provider: 'DeepSeek',
    name: 'DeepSeek Reasoner',
    inputPrice: 0.55,
    outputPrice: 2.19,
    contextWindow: 64000,
  },

  // Google Gemini
  {
    id: 'gemini-2.0-flash',
    provider: 'Google',
    name: 'Gemini 2.0 Flash',
    inputPrice: 0.075,
    outputPrice: 0.3,
    contextWindow: 1000000,
  },
  {
    id: 'gemini-1.5-pro',
    provider: 'Google',
    name: 'Gemini 1.5 Pro',
    inputPrice: 1.25,
    outputPrice: 5.0,
    contextWindow: 2000000,
  },
  {
    id: 'gemini-1.5-flash',
    provider: 'Google',
    name: 'Gemini 1.5 Flash',
    inputPrice: 0.075,
    outputPrice: 0.3,
    contextWindow: 1000000,
  },
];

/**
 * Merge custom models with default models
 * Custom models take precedence over defaults if they have the same ID
 */
export function mergeModels(customModels: ModelPricing[] = []): ModelPricing[] {
  const modelMap = new Map<string, ModelPricing>();

  // Add default models first
  DEFAULT_MODEL_PRICING.forEach((model) => {
    modelMap.set(model.id, { ...model });
  });

  // Override with custom models
  customModels.forEach((customModel) => {
    const existing = modelMap.get(customModel.id);
    if (existing && !customModel.isCustom) {
      // Apply price override to existing model
      modelMap.set(customModel.id, {
        ...existing,
        priceOverride: {
          inputPrice: customModel.inputPrice,
          outputPrice: customModel.outputPrice,
        },
      });
    } else {
      // Add or replace with custom model
      modelMap.set(customModel.id, { ...customModel, isCustom: true });
    }
  });

  return Array.from(modelMap.values());
}

/**
 * Get effective pricing (considering overrides)
 */
export function getEffectivePricing(model: ModelPricing): {
  inputPrice: number;
  outputPrice: number;
} {
  if (model.priceOverride) {
    return {
      inputPrice: model.priceOverride.inputPrice ?? model.inputPrice,
      outputPrice: model.priceOverride.outputPrice ?? model.outputPrice,
    };
  }
  return {
    inputPrice: model.inputPrice,
    outputPrice: model.outputPrice,
  };
}

// Legacy export for backward compatibility
export const MODEL_PRICING = DEFAULT_MODEL_PRICING;
