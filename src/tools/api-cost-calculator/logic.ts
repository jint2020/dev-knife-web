import { encode } from 'gpt-tokenizer';
import { mergeModels, getEffectivePricing, type ModelPricing } from './pricing';

// ==================== Types ====================

export interface PromptInputs {
  system: string;
  history: string;
  user: string;
}

export interface SimulationState {
  // Text inputs for token counting
  inputs: PromptInputs & { output: string };
  // Output length mode: 'text' | 'slider'
  outputMode: 'text' | 'slider';
  // Output token estimate (when using slider)
  outputTokenEstimate: number;
  // Model configuration
  modelConfig: {
    selectedId: string;
    customModels: ModelPricing[];
    exchangeRate: number;
  };
  // Batch estimation
  batchConfig: {
    enabled: boolean;
    volume: number;
    period: 'day' | 'month' | 'year';
  };
}

export interface TokenBreakdown {
  system: number;
  history: number;
  user: number;
  totalInput: number;
  output: number;
  total: number;
  characters: {
    system: number;
    history: number;
    user: number;
    output: number;
  };
}

export interface CostCalculation {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  inputCostCNY?: number;
  outputCostCNY?: number;
  totalCostCNY?: number;
}

export interface CostAnalysis {
  tokens: TokenBreakdown;
  costs: CostCalculation;
  model: ModelPricing | null;
  effectivePricing: { inputPrice: number; outputPrice: number } | null;
  contextUsage: {
    used: number;
    limit: number;
    percentage: number;
  } | null;
  projection?: {
    period: string;
    volume: number;
    totalCost: number;
    totalCostCNY?: number;
  };
}

// ==================== Token Counting ====================

/**
 * Count tokens for a single text input
 */
export function countTokens(text: string): number {
  if (!text) return 0;
  const tokens = encode(text);
  return tokens.length;
}

/**
 * Calculate token breakdown for all inputs
 */
export function calculateTokenBreakdown(inputs: SimulationState['inputs'], outputTokenEstimate: number): TokenBreakdown {
  const system = countTokens(inputs.system);
  const history = countTokens(inputs.history);
  const user = countTokens(inputs.user);
  const output =
    inputs.outputMode === 'slider'
      ? outputTokenEstimate
      : countTokens(inputs.output);

  const totalInput = system + history + user;
  const total = totalInput + output;

  return {
    system,
    history,
    user,
    totalInput,
    output,
    total,
    characters: {
      system: inputs.system.length,
      history: inputs.history.length,
      user: inputs.user.length,
      output: inputs.output.length,
    },
  };
}

// ==================== Cost Calculation ====================

/**
 * Calculate cost based on tokens and model pricing
 */
export function calculateCost(
  model: ModelPricing,
  inputTokens: number,
  outputTokens: number,
  exchangeRate?: number
): CostCalculation {
  const pricing = getEffectivePricing(model);

  // Calculate cost per million tokens
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;
  const totalCost = inputCost + outputCost;

  const result: CostCalculation = {
    inputCost,
    outputCost,
    totalCost,
  };

  // Add CNY conversion if exchange rate is provided
  if (exchangeRate && exchangeRate > 0) {
    result.inputCostCNY = inputCost * exchangeRate;
    result.outputCostCNY = outputCost * exchangeRate;
    result.totalCostCNY = totalCost * exchangeRate;
  }

  return result;
}

// ==================== Model Management ====================

/**
 * Get all models merged with custom models
 */
export function getAllModels(customModels: ModelPricing[] = []): ModelPricing[] {
  return mergeModels(customModels);
}

/**
 * Get model by ID from custom models or defaults
 */
export function getModelById(modelId: string, customModels: ModelPricing[] = []): ModelPricing | undefined {
  const allModels = getAllModels(customModels);
  return allModels.find((m) => m.id === modelId);
}

/**
 * Group models by provider
 */
export function getModelsByProvider(models: ModelPricing[]): Record<string, ModelPricing[]> {
  return models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, ModelPricing[]>);
}

// ==================== Complete Analysis ====================

/**
 * Perform complete cost analysis based on simulation state
 */
export function analyzeCost(state: SimulationState): CostAnalysis {
  const { inputs, modelConfig, batchConfig, outputTokenEstimate } = state;

  // Get model
  const model = getModelById(modelConfig.selectedId, modelConfig.customModels);
  if (!model) {
    return {
      tokens: calculateTokenBreakdown(inputs, outputTokenEstimate),
      costs: {
        inputCost: 0,
        outputCost: 0,
        totalCost: 0,
      },
      model: null,
      effectivePricing: null,
      contextUsage: null,
    };
  }

  const effectivePricing = getEffectivePricing(model);

  // Calculate token breakdown
  const tokens = calculateTokenBreakdown(inputs, outputTokenEstimate);

  // Calculate costs
  const costs = calculateCost(
    model,
    tokens.totalInput,
    tokens.output,
    modelConfig.exchangeRate > 0 ? modelConfig.exchangeRate : undefined
  );

  // Calculate context usage
  const contextUsage =
    model.contextWindow && model.contextWindow > 0
      ? {
          used: tokens.totalInput,
          limit: model.contextWindow,
          percentage: (tokens.totalInput / model.contextWindow) * 100,
        }
      : null;

  // Calculate projection if batch is enabled
  let projection;
  if (batchConfig.enabled && batchConfig.volume > 0) {
    const multiplier = batchConfig.volume;
    const periodLabel =
      batchConfig.period === 'day'
        ? 'Day'
        : batchConfig.period === 'month'
        ? 'Month'
        : 'Year';

    projection = {
      period: periodLabel,
      volume: multiplier,
      totalCost: costs.totalCost * multiplier,
      totalCostCNY:
        costs.totalCostCNY !== undefined
          ? costs.totalCostCNY * multiplier
          : undefined,
    };
  }

  return {
    tokens,
    costs,
    model,
    effectivePricing,
    contextUsage,
    projection,
  };
}

// ==================== Helpers ====================

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: 'USD' | 'CNY' = 'USD'): string {
  if (currency === 'USD') {
    return `$${amount.toFixed(6)}`;
  }
  return `¥${amount.toFixed(4)}`;
}

/**
 * Format token count for display
 */
export function formatTokenCount(count: number): string {
  return count.toLocaleString();
}

/**
 * Calculate percentage of context window used
 */
export function calculateContextPercentage(used: number, limit: number): number {
  return Math.min((used / limit) * 100, 100);
}
