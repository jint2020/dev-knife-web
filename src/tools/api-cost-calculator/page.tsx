import { useTranslation } from 'react-i18next';
import { ToolPage, ToolSection } from '@/components/tool-ui';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { CopyButton } from '@/components/common/copy-button';
import { Badge } from '@/components/ui/badge';
import { useToolPersistence } from '@/hooks/useToolPersistence';
import {
  analyzeCost,
  getAllModels,
  getModelsByProvider,
  type SimulationState,
  type ModelPricing,
  formatTokenCount,
} from './logic';
import {
  ChevronDown,
  Settings,
  TrendingUp,
  Hash,
  DollarSign,
  Info,
  Loader2,
  Check,
  X,
  Plus,
  Edit,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

export default function ApiCostCalculatorPage() {
  const { t } = useTranslation();

  // Default state
  const defaultState: SimulationState = {
    inputs: {
      system: '',
      history: '',
      user: '',
      output: '',
    },
    outputMode: 'slider',
    outputTokenEstimate: 1000,
    modelConfig: {
      selectedId: 'gpt-4o',
      customModels: [],
      exchangeRate: 7.25,
    },
    batchConfig: {
      enabled: false,
      volume: 1000,
      period: 'month',
    },
  };

  const [state, setState] = useToolPersistence<SimulationState>(
    'api-cost-calculator-v2',
    defaultState
  );

  const allModels = getAllModels(state.modelConfig.customModels);
  const modelsByProvider = getModelsByProvider(allModels);
  const analysis = analyzeCost(state);

  // UI states
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelPricing | null>(null);

  // Toggle section
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Update state helper
  const updateState = (updates: Partial<SimulationState>) => {
    setState({ ...state, ...updates });
  };

  // Update inputs helper
  const updateInputs = (field: keyof SimulationState['inputs'], value: string) => {
    updateState({
      inputs: { ...state.inputs, [field]: value },
    });
  };

  // Update model config helper
  const updateModelConfig = (updates: Partial<SimulationState['modelConfig']>) => {
    updateState({
      modelConfig: { ...state.modelConfig, ...updates },
    });
  };

  // Update batch config helper
  const updateBatchConfig = (updates: Partial<SimulationState['batchConfig']>) => {
    updateState({
      batchConfig: { ...state.batchConfig, ...updates },
    });
  };

  // Calculate simple mode costs (backward compatible)
  const simpleInputTokens = parseInt('1000') || 0;
  const simpleOutputTokens = parseInt('1000') || 0;
  const simpleExchangeRate = parseFloat(String(state.modelConfig.exchangeRate)) || 0;

  // Get model pricing info
  const selectedModel = allModels.find((m) => m.id === state.modelConfig.selectedId);

  // Generate summary text for copying
  const generateSummary = () => {
    if (!analysis.model) return '';

    const lines = [
      `LLM Cost Estimation Summary`,
      `===========================`,
      ``,
      `Model: ${analysis.model.name} (${analysis.model.provider})`,
      ``,
      `Token Breakdown:`,
      `  System: ${formatTokenCount(analysis.tokens.system)} tokens`,
      `  History: ${formatTokenCount(analysis.tokens.history)} tokens`,
      `  User: ${formatTokenCount(analysis.tokens.user)} tokens`,
      `  Total Input: ${formatTokenCount(analysis.tokens.totalInput)} tokens`,
      `  Output: ${formatTokenCount(analysis.tokens.output)} tokens`,
      `  Total: ${formatTokenCount(analysis.tokens.total)} tokens`,
      ``,
      `Cost Breakdown:`,
      `  Input: $${analysis.costs.inputCost.toFixed(6)}`,
      `  Output: $${analysis.costs.outputCost.toFixed(6)}`,
      `  Total: $${analysis.costs.totalCost.toFixed(6)}`,
    ];

    if (analysis.costs.totalCostCNY !== undefined) {
      lines.push(
        ``,
        `CNY Conversion:`,
        `  Input: ¥${analysis.costs.inputCostCNY.toFixed(4)}`,
        `  Output: ¥${analysis.costs.outputCostCNY.toFixed(4)}`,
        `  Total: ¥${analysis.costs.totalCostCNY.toFixed(4)}`
      );
    }

    if (analysis.contextUsage) {
      lines.push(
        ``,
        `Context Usage:`,
        `  ${formatTokenCount(analysis.contextUsage.used)} / ${formatTokenCount(
          analysis.contextUsage.limit
        )} (${analysis.contextUsage.percentage.toFixed(1)}%)`
      );
    }

    if (analysis.projection) {
      lines.push(
        ``,
        `Projection (${analysis.projection.volume} requests/${analysis.projection.period}):`,
        `  Total Cost: $${analysis.projection.totalCost.toFixed(4)}`
      );
      if (analysis.projection.totalCostCNY !== undefined) {
        lines.push(`  Total CNY: ¥${analysis.projection.totalCostCNY.toFixed(2)}`);
      }
    }

    return lines.join('\n');
  };

  return (
    <ToolPage
      title={t('tools.apiCostCalculator.title')}
      description={t('tools.apiCostCalculator.description')}
    >
      <Tabs defaultValue="advanced" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">
            {t('tools.apiCostCalculator.simpleMode')}
          </TabsTrigger>
          <TabsTrigger value="advanced">
            {t('tools.apiCostCalculator.advancedMode')}
          </TabsTrigger>
        </TabsList>

        {/* Simple Mode */}
        <TabsContent value="simple" className="space-y-6">
          <ToolSection
            title={t('tools.apiCostCalculator.configuration')}
            description={t('tools.apiCostCalculator.configurationDescription')}
            contentClassName="space-y-4"
          >
            <div className="space-y-2">
              <Label>{t('tools.apiCostCalculator.modelLabel')}</Label>
              <Select
                value={state.modelConfig.selectedId}
                onValueChange={(value) => updateModelConfig({ selectedId: value })}
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
                <Label>{t('tools.apiCostCalculator.inputTokensLabel')}</Label>
                <Input
                  type="number"
                  min="0"
                  defaultValue="1000"
                  placeholder="1000"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('tools.apiCostCalculator.outputTokensLabel')}</Label>
                <Input type="number" min="0" defaultValue="1000" placeholder="1000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('tools.apiCostCalculator.exchangeRateLabel')}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={state.modelConfig.exchangeRate}
                onChange={(e) =>
                  updateModelConfig({ exchangeRate: parseFloat(e.target.value) || 0 })
                }
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
                    <span className="ml-2 font-mono">
                      ${(selectedModel.priceOverride?.inputPrice ?? selectedModel.inputPrice).toFixed(2)}
                      /1M
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {t('tools.apiCostCalculator.outputPrice')}:
                    </span>
                    <span className="ml-2 font-mono">
                      ${(selectedModel.priceOverride?.outputPrice ?? selectedModel.outputPrice).toFixed(2)}
                      /1M
                    </span>
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
                  ${((simpleInputTokens / 1_000_000) * (selectedModel?.inputPrice || 0)).toFixed(6)}
                </div>
                {simpleExchangeRate > 0 && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    ¥{((simpleInputTokens / 1_000_000) * (selectedModel?.inputPrice || 0) * simpleExchangeRate).toFixed(4)}
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  {t('tools.apiCostCalculator.outputCost')}
                </div>
                <div className="mt-2 text-2xl font-bold font-mono">
                  ${((simpleOutputTokens / 1_000_000) * (selectedModel?.outputPrice || 0)).toFixed(6)}
                </div>
                {simpleExchangeRate > 0 && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    ¥{((simpleOutputTokens / 1_000_000) * (selectedModel?.outputPrice || 0) * simpleExchangeRate).toFixed(4)}
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  {t('tools.apiCostCalculator.totalCost')}
                </div>
                <div className="mt-2 text-2xl font-bold font-mono">
                  $
                  {(
                    (simpleInputTokens / 1_000_000) * (selectedModel?.inputPrice || 0) +
                    (simpleOutputTokens / 1_000_000) * (selectedModel?.outputPrice || 0)
                  ).toFixed(6)}
                </div>
                {simpleExchangeRate > 0 && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    ¥
                    {(
                      ((simpleInputTokens / 1_000_000) * (selectedModel?.inputPrice || 0) +
                        (simpleOutputTokens / 1_000_000) * (selectedModel?.outputPrice || 0)) *
                      simpleExchangeRate
                    ).toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {t('tools.apiCostCalculator.disclaimer')}
            </div>
          </ToolSection>
        </TabsContent>

        {/* Advanced Mode */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Configuration & Inputs */}
            <div className="space-y-6">
              {/* Model Configuration */}
              <ToolSection
                title={t('tools.apiCostCalculator.modelConfiguration')}
                icon={<Settings className="h-4 w-4" />}
                contentClassName="space-y-4"
              >
                <div className="space-y-2">
                  <Label>{t('tools.apiCostCalculator.modelLabel')}</Label>
                  <Select
                    value={state.modelConfig.selectedId}
                    onValueChange={(value) => updateModelConfig({ selectedId: value })}
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
                              <div className="flex items-center gap-2">
                                <span>{model.name}</span>
                                {model.isCustom && (
                                  <Badge variant="secondary" className="text-xs">
                                    Custom
                                  </Badge>
                                )}
                                {model.priceOverride && (
                                  <Badge variant="outline" className="text-xs">
                                    Modified
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
                  </Select>
                </div>

                {selectedModel && (
                  <div className="rounded-lg border bg-card p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{selectedModel.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => {
                          setEditingModel(selectedModel);
                          setShowModelDialog(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                        {t('tools.apiCostCalculator.edit')}
                      </Button>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Input:</span>{' '}
                        <span className="font-mono">
                          $
                          {(
                            selectedModel.priceOverride?.inputPrice ?? selectedModel.inputPrice
                          ).toFixed(2)}
                          /1M
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Output:</span>{' '}
                        <span className="font-mono">
                          $
                          {(
                            selectedModel.priceOverride?.outputPrice ??
                            selectedModel.outputPrice
                          ).toFixed(2)}
                          /1M
                        </span>
                      </div>
                      {selectedModel.contextWindow && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Context:</span>{' '}
                          <span className="font-mono">
                            {formatTokenCount(selectedModel.contextWindow)} tokens
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    const newCustomModel: ModelPricing = {
                      id: `custom-${Date.now()}`,
                      provider: 'Custom',
                      name: 'My Custom Model',
                      inputPrice: 1.0,
                      outputPrice: 2.0,
                      contextWindow: 128000,
                      isCustom: true,
                    };
                    setEditingModel(newCustomModel);
                    setShowModelDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {t('tools.apiCostCalculator.addCustomModel')}
                </Button>

                <div className="space-y-2">
                  <Label>{t('tools.apiCostCalculator.exchangeRateLabel')}</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={state.modelConfig.exchangeRate}
                    onChange={(e) =>
                      updateModelConfig({ exchangeRate: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="7.25"
                  />
                </div>
              </ToolSection>

              {/* Prompt Inputs */}
              <ToolSection
                title={t('tools.apiCostCalculator.promptInputs')}
                description={t('tools.apiCostCalculator.promptInputsDescription')}
                contentClassName="space-y-3"
              >
                {/* System Prompt */}
                <Collapsible
                  open={activeSection === 'system'}
                  onOpenChange={() => toggleSection('system')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-between px-0"
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t('tools.apiCostCalculator.systemPrompt')}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {formatTokenCount(analysis.tokens.system)} tokens
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          activeSection === 'system' ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <Textarea
                      value={state.inputs.system}
                      onChange={(e) => updateInputs('system', e.target.value)}
                      placeholder={t('tools.apiCostCalculator.systemPromptPlaceholder')}
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </CollapsibleContent>
                </Collapsible>

                {/* History */}
                <Collapsible
                  open={activeSection === 'history'}
                  onOpenChange={() => toggleSection('history')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-between px-0"
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t('tools.apiCostCalculator.conversationHistory')}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {formatTokenCount(analysis.tokens.history)} tokens
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          activeSection === 'history' ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <Textarea
                      value={state.inputs.history}
                      onChange={(e) => updateInputs('history', e.target.value)}
                      placeholder={t('tools.apiCostCalculator.historyPlaceholder')}
                      className="min-h-[100px] font-mono text-sm"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('tools.apiCostCalculator.historyHint')}
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                {/* User Input */}
                <Collapsible
                  open={activeSection === 'user'}
                  onOpenChange={() => toggleSection('user')}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-between px-0"
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t('tools.apiCostCalculator.userPrompt')}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {formatTokenCount(analysis.tokens.user)} tokens
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          activeSection === 'user' ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <Textarea
                      value={state.inputs.user}
                      onChange={(e) => updateInputs('user', e.target.value)}
                      placeholder={t('tools.apiCostCalculator.userPromptPlaceholder')}
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </CollapsibleContent>
                </Collapsible>
              </ToolSection>

              {/* Output Simulator */}
              <ToolSection
                title={t('tools.apiCostCalculator.outputEstimation')}
                description={t('tools.apiCostCalculator.outputEstimationDescription')}
                contentClassName="space-y-4"
              >
                <Tabs
                  value={state.outputMode}
                  onValueChange={(value) =>
                    updateState({ outputMode: value as 'text' | 'slider' })
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="slider">
                      {t('tools.apiCostCalculator.sliderMode')}
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      {t('tools.apiCostCalculator.textMode')}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="slider" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>
                          {t('tools.apiCostCalculator.estimatedOutputTokens')}
                        </Label>
                        <Badge variant="secondary">
                          {formatTokenCount(state.outputTokenEstimate)} tokens
                        </Badge>
                      </div>
                      <Slider
                        value={[state.outputTokenEstimate]}
                        onValueChange={(value) =>
                          updateState({ outputTokenEstimate: value[0] })
                        }
                        min={0}
                        max={10000}
                        step={100}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>5,000</span>
                        <span>10,000</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-2">
                    <Label>{t('tools.apiCostCalculator.expectedOutput')}</Label>
                    <Textarea
                      value={state.inputs.output}
                      onChange={(e) => updateInputs('output', e.target.value)}
                      placeholder={t('tools.apiCostCalculator.outputPlaceholder')}
                      className="min-h-[150px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('tools.apiCostCalculator.outputModeHint')}
                    </p>
                  </TabsContent>
                </Tabs>
              </ToolSection>

              {/* Batch Projection */}
              <ToolSection
                title={t('tools.apiCostCalculator.batchProjection')}
                icon={<TrendingUp className="h-4 w-4" />}
                contentClassName="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="batch-enabled"
                    checked={state.batchConfig.enabled}
                    onCheckedChange={(checked) =>
                      updateBatchConfig({ enabled: checked as boolean })
                    }
                  />
                  <Label htmlFor="batch-enabled" className="cursor-pointer">
                    {t('tools.apiCostCalculator.enableBatchProjection')}
                  </Label>
                </div>

                {state.batchConfig.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('tools.apiCostCalculator.volumeLabel')}</Label>
                      <Input
                        type="number"
                        min="1"
                        value={state.batchConfig.volume}
                        onChange={(e) =>
                          updateBatchConfig({ volume: parseInt(e.target.value) || 1 })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('tools.apiCostCalculator.periodLabel')}</Label>
                      <Select
                        value={state.batchConfig.period}
                        onValueChange={(value: 'day' | 'month' | 'year') =>
                          updateBatchConfig({ period: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">
                            {t('tools.apiCostCalculator.periodDay')}
                          </SelectItem>
                          <SelectItem value="month">
                            {t('tools.apiCostCalculator.periodMonth')}
                          </SelectItem>
                          <SelectItem value="year">
                            {t('tools.apiCostCalculator.periodYear')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </ToolSection>
            </div>

            {/* Right Column - Live Analysis (Sticky) */}
            <div className="space-y-4">
              <div className="sticky top-4 space-y-4">
                {/* Token Usage Card */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">
                      {t('tools.apiCostCalculator.tokenUsage')}
                    </h3>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t('tools.apiCostCalculator.totalInput')}
                        </span>
                        <span className="font-mono font-medium">
                          {formatTokenCount(analysis.tokens.totalInput)} tokens
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: analysis.contextUsage
                              ? `${Math.min(analysis.contextUsage.percentage, 100)}%`
                              : '0%',
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t('tools.apiCostCalculator.output')}
                        </span>
                        <span className="font-mono font-medium">
                          {formatTokenCount(analysis.tokens.output)} tokens
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{t('tools.apiCostCalculator.total')}</span>
                        <span className="font-mono text-lg font-bold">
                          {formatTokenCount(analysis.tokens.total)}
                        </span>
                      </div>
                    </div>

                    {/* Token Breakdown */}
                    <div className="border-t pt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>System:</span>
                        <span className="font-mono">
                          {formatTokenCount(analysis.tokens.system)}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>History:</span>
                        <span className="font-mono">
                          {formatTokenCount(analysis.tokens.history)}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>User:</span>
                        <span className="font-mono">
                          {formatTokenCount(analysis.tokens.user)}
                        </span>
                      </div>
                    </div>

                    {/* Context Window Progress */}
                    {analysis.contextUsage && (
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <Info className="h-3 w-3" />
                          <span>
                            {t('tools.apiCostCalculator.contextWindow')}: {formatTokenCount(analysis.contextUsage.used)} /{' '}
                            {formatTokenCount(analysis.contextUsage.limit)} (
                            {analysis.contextUsage.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full transition-all ${
                              analysis.contextUsage.percentage > 90
                                ? 'bg-destructive'
                                : analysis.contextUsage.percentage > 75
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(analysis.contextUsage.percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cost Breakdown Card */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">
                        {t('tools.apiCostCalculator.costBreakdown')}
                      </h3>
                    </div>
                    <CopyButton value={generateSummary()} />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t('tools.apiCostCalculator.inputCost')}
                      </span>
                      <div className="text-right">
                        <div className="font-mono font-medium">
                          ${analysis.costs.inputCost.toFixed(6)}
                        </div>
                        {analysis.costs.inputCostCNY !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            ¥{analysis.costs.inputCostCNY.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t('tools.apiCostCalculator.outputCost')}
                      </span>
                      <div className="text-right">
                        <div className="font-mono font-medium">
                          ${analysis.costs.outputCost.toFixed(6)}
                        </div>
                        {analysis.costs.outputCostCNY !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            ¥{analysis.costs.outputCostCNY.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{t('tools.apiCostCalculator.totalCost')}</span>
                        <div className="text-right">
                          <div className="font-mono text-lg font-bold">
                            ${analysis.costs.totalCost.toFixed(6)}
                          </div>
                          {analysis.costs.totalCostCNY !== undefined && (
                            <div className="text-sm text-muted-foreground">
                              ¥{analysis.costs.totalCostCNY.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projection Card */}
                {analysis.projection && (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">
                        {t('tools.apiCostCalculator.projection')}
                      </h3>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume:</span>
                        <span className="font-mono">
                          {analysis.projection.volume.toLocaleString()} requests/
                          {analysis.projection.period.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total Cost:</span>
                        <div className="text-right">
                          <div className="font-mono font-bold">
                            ${analysis.projection.totalCost.toFixed(4)}
                          </div>
                          {analysis.projection.totalCostCNY !== undefined && (
                            <div className="text-xs text-muted-foreground">
                              ¥{analysis.projection.totalCostCNY.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Reference */}
                {analysis.effectivePricing && (
                  <div className="rounded-lg border bg-muted/50 p-3 text-xs">
                    <div className="font-medium mb-2">
                      {t('tools.apiCostCalculator.effectivePricing')}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Input:</span>{' '}
                        <span className="font-mono">
                          ${analysis.effectivePricing.inputPrice.toFixed(2)}/1M
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Output:</span>{' '}
                        <span className="font-mono">
                          ${analysis.effectivePricing.outputPrice.toFixed(2)}/1M
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Model Edit Dialog */}
      <Dialog open={showModelDialog} onOpenChange={setShowModelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingModel?.isCustom
                ? t('tools.apiCostCalculator.editCustomModel')
                : t('tools.apiCostCalculator.editModelPricing')}
            </DialogTitle>
            <DialogDescription>
              {editingModel?.isCustom
                ? t('tools.apiCostCalculator.editCustomModelDesc')
                : t('tools.apiCostCalculator.editModelPricingDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">{t('tools.apiCostCalculator.modelName')}</Label>
              <Input
                id="model-name"
                value={editingModel?.name || ''}
                onChange={(e) =>
                  setEditingModel(editingModel ? { ...editingModel, name: e.target.value } : null)
                }
                disabled={!editingModel?.isCustom}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="input-price">{t('tools.apiCostCalculator.inputPrice')} ($/1M)</Label>
                <Input
                  id="input-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingModel?.priceOverride?.inputPrice ?? editingModel?.inputPrice ?? ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    if (editingModel) {
                      if (editingModel.isCustom) {
                        setEditingModel({ ...editingModel, inputPrice: value });
                      } else {
                        setEditingModel({
                          ...editingModel,
                          priceOverride: {
                            ...(editingModel.priceOverride || {}),
                            inputPrice: value,
                          },
                        });
                      }
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="output-price">{t('tools.apiCostCalculator.outputPrice')} ($/1M)</Label>
                <Input
                  id="output-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingModel?.priceOverride?.outputPrice ?? editingModel?.outputPrice ?? ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    if (editingModel) {
                      if (editingModel.isCustom) {
                        setEditingModel({ ...editingModel, outputPrice: value });
                      } else {
                        setEditingModel({
                          ...editingModel,
                          priceOverride: {
                            ...(editingModel.priceOverride || {}),
                            outputPrice: value,
                          },
                        });
                      }
                    }
                  }}
                />
              </div>
            </div>
            {editingModel?.isCustom && (
              <div className="space-y-2">
                <Label htmlFor="context-window">{t('tools.apiCostCalculator.contextWindow')}</Label>
                <Input
                  id="context-window"
                  type="number"
                  min="0"
                  value={editingModel?.contextWindow || ''}
                  onChange={(e) =>
                    setEditingModel(
                      editingModel ? { ...editingModel, contextWindow: parseInt(e.target.value) || 0 } : null
                    )
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowModelDialog(false);
                setEditingModel(null);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => {
                if (editingModel) {
                  // Check if it's a custom model or price override
                  if (editingModel.isCustom) {
                    // Add or update custom model
                    const existingCustomIndex = state.modelConfig.customModels.findIndex(
                      (m) => m.id === editingModel.id
                    );
                    let newCustomModels;
                    if (existingCustomIndex >= 0) {
                      newCustomModels = [...state.modelConfig.customModels];
                      newCustomModels[existingCustomIndex] = editingModel;
                    } else {
                      newCustomModels = [...state.modelConfig.customModels, editingModel];
                    }
                    updateModelConfig({ customModels: newCustomModels });
                  } else if (editingModel.priceOverride) {
                    // Add price override for built-in model
                    const overrideModel = {
                      id: editingModel.id,
                      provider: editingModel.provider,
                      name: editingModel.name,
                      inputPrice: editingModel.priceOverride.inputPrice!,
                      outputPrice: editingModel.priceOverride.outputPrice!,
                    };
                    const existingOverrideIndex = state.modelConfig.customModels.findIndex(
                      (m) => m.id === editingModel.id && !m.isCustom
                    );
                    let newCustomModels;
                    if (existingOverrideIndex >= 0) {
                      newCustomModels = [...state.modelConfig.customModels];
                      newCustomModels[existingOverrideIndex] = overrideModel;
                    } else {
                      newCustomModels = [...state.modelConfig.customModels, overrideModel];
                    }
                    updateModelConfig({ customModels: newCustomModels });
                  }
                }
                setShowModelDialog(false);
                setEditingModel(null);
              }}
            >
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ToolPage>
  );
}
