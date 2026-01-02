import { MODEL_PRICING, type ModelPricing } from './pricing';

export interface CostCalculation {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  inputCostCNY?: number;
  outputCostCNY?: number;
  totalCostCNY?: number;
}

/**
 * Calculate the cost for LLM API usage
 * @param modelId - The model identifier
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @param exchangeRate - Optional USD to CNY exchange rate
 */
export function calculateCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
  exchangeRate?: number
): CostCalculation {
  const model = MODEL_PRICING.find((m) => m.id === modelId);

  if (!model) {
    return {
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
    };
  }

  // Calculate cost per million tokens
  const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
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

/**
 * Get model pricing information by model ID
 */
export function getModelPricing(modelId: string): ModelPricing | undefined {
  return MODEL_PRICING.find((m) => m.id === modelId);
}

/**
 * Group models by provider
 */
export function getModelsByProvider(): Record<string, ModelPricing[]> {
  return MODEL_PRICING.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, ModelPricing[]>);
}
