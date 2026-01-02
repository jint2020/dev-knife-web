import { useTranslation } from 'react-i18next';
import { ToolPage, ToolSection } from '@/components/tool-ui';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToolPersistence } from '@/hooks/useToolPersistence';
import { calculateCost, getModelsByProvider, getModelPricing } from './logic';

interface CostCalculatorState {
  modelId: string;
  inputTokens: string;
  outputTokens: string;
  exchangeRate: string;
}

export default function ApiCostCalculatorPage() {
  const { t } = useTranslation();

  const [state, setState] = useToolPersistence<CostCalculatorState>('api-cost-calculator', {
    modelId: 'gpt-4o',
    inputTokens: '1000',
    outputTokens: '1000',
    exchangeRate: '7.25',
  });

  const inputTokens = parseInt(state.inputTokens) || 0;
  const outputTokens = parseInt(state.outputTokens) || 0;
  const exchangeRate = parseFloat(state.exchangeRate) || 0;

  const cost = calculateCost(
    state.modelId,
    inputTokens,
    outputTokens,
    exchangeRate > 0 ? exchangeRate : undefined
  );

  const selectedModel = getModelPricing(state.modelId);
  const modelsByProvider = getModelsByProvider();

  return (
    <ToolPage
      title={t('tools.apiCostCalculator.title')}
      description={t('tools.apiCostCalculator.description')}
    >
      <ToolSection
        title={t('tools.apiCostCalculator.configuration')}
        description={t('tools.apiCostCalculator.configurationDescription')}
        contentClassName="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tools.apiCostCalculator.modelLabel')}</label>
          <Select
            value={state.modelId}
            onValueChange={(value) => setState({ modelId: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(modelsByProvider).map(([provider, models]) => (
                <SelectGroup key={provider}>
                  <SelectLabel>{provider}</SelectLabel>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('tools.apiCostCalculator.inputTokensLabel')}
            </label>
            <Input
              type="number"
              min="0"
              value={state.inputTokens}
              onChange={(e) => setState({ inputTokens: e.target.value })}
              placeholder="1000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('tools.apiCostCalculator.outputTokensLabel')}
            </label>
            <Input
              type="number"
              min="0"
              value={state.outputTokens}
              onChange={(e) => setState({ outputTokens: e.target.value })}
              placeholder="1000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('tools.apiCostCalculator.exchangeRateLabel')}
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={state.exchangeRate}
            onChange={(e) => setState({ exchangeRate: e.target.value })}
            placeholder="7.25"
          />
          <p className="text-xs text-muted-foreground">
            {t('tools.apiCostCalculator.exchangeRateHint')}
          </p>
        </div>
      </ToolSection>

      {selectedModel && (
        <ToolSection
          title={t('tools.apiCostCalculator.pricing')}
          contentClassName="space-y-2"
        >
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium">{selectedModel.name}</div>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  {t('tools.apiCostCalculator.inputPrice')}:
                </span>
                <span className="ml-2 font-mono">${selectedModel.inputPrice.toFixed(2)}/1M</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t('tools.apiCostCalculator.outputPrice')}:
                </span>
                <span className="ml-2 font-mono">${selectedModel.outputPrice.toFixed(2)}/1M</span>
              </div>
            </div>
          </div>
        </ToolSection>
      )}

      <ToolSection
        title={t('tools.apiCostCalculator.result')}
        contentClassName="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">
              {t('tools.apiCostCalculator.inputCost')}
            </div>
            <div className="mt-2 text-2xl font-bold font-mono">
              ${cost.inputCost.toFixed(6)}
            </div>
            {cost.inputCostCNY !== undefined && (
              <div className="mt-1 text-sm text-muted-foreground">
                ¥{cost.inputCostCNY.toFixed(4)}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">
              {t('tools.apiCostCalculator.outputCost')}
            </div>
            <div className="mt-2 text-2xl font-bold font-mono">
              ${cost.outputCost.toFixed(6)}
            </div>
            {cost.outputCostCNY !== undefined && (
              <div className="mt-1 text-sm text-muted-foreground">
                ¥{cost.outputCostCNY.toFixed(4)}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">
              {t('tools.apiCostCalculator.totalCost')}
            </div>
            <div className="mt-2 text-2xl font-bold font-mono">
              ${cost.totalCost.toFixed(6)}
            </div>
            {cost.totalCostCNY !== undefined && (
              <div className="mt-1 text-sm text-muted-foreground">
                ¥{cost.totalCostCNY.toFixed(4)}
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {t('tools.apiCostCalculator.disclaimer')}
        </div>
      </ToolSection>
    </ToolPage>
  );
}
