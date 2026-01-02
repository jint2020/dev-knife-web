import { encode } from 'gpt-tokenizer';

export type ModelType = 'gpt-4o' | 'gpt-3.5-turbo' | 'claude-3.5-sonnet' | 'gemini-pro';

export interface TokenCountResult {
  tokenCount: number;
  characterCount: number;
}

/**
 * Count tokens and characters for the given text
 * Uses gpt-tokenizer which implements the cl100k_base encoding used by GPT-4 and GPT-3.5
 */
export function countTokens(text: string, _model: ModelType = 'gpt-4o'): TokenCountResult {
  // For now, we use the same tokenizer for all models
  // In a real implementation, different models might use different tokenizers
  const tokens = encode(text);

  return {
    tokenCount: tokens.length,
    characterCount: text.length,
  };
}

/**
 * Get model display name
 */
export function getModelDisplayName(model: ModelType): string {
  const modelNames: Record<ModelType, string> = {
    'gpt-4o': 'GPT-4o',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'claude-3.5-sonnet': 'Claude 3.5 Sonnet',
    'gemini-pro': 'Gemini Pro',
  };

  return modelNames[model];
}
