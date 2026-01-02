import { useTranslation } from 'react-i18next';
import { ToolPage, ToolSection } from '@/components/tool-ui';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CopyButton } from '@/components/common/copy-button';
import { useToolPersistence } from '@/hooks/useToolPersistence';
import { countTokens, type ModelType } from './logic';
import { Trash2 } from 'lucide-react';

interface TokenCounterState {
  text: string;
  model: ModelType;
}

export default function TokenCounterPage() {
  const { t } = useTranslation();

  const [state, setState] = useToolPersistence<TokenCounterState>('token-counter', {
    text: '',
    model: 'gpt-4o',
  });

  const result = countTokens(state.text, state.model);

  const handleClear = () => {
    setState({ text: '' });
  };

  return (
    <ToolPage
      title={t('tools.tokenCounter.title')}
      description={t('tools.tokenCounter.description')}
    >
      <ToolSection
        title={t('tools.tokenCounter.input')}
        description={t('tools.tokenCounter.inputDescription')}
        contentClassName="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tools.tokenCounter.modelLabel')}</label>
          <Select
            value={state.model}
            onValueChange={(value) => setState({ model: value as ModelType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tools.tokenCounter.textLabel')}</label>
          <Textarea
            value={state.text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setState({ text: e.target.value })}
            placeholder={t('tools.tokenCounter.textPlaceholder')}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <Button onClick={handleClear} variant="outline" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          {t('tools.tokenCounter.clear')}
        </Button>
      </ToolSection>

      <ToolSection
        title={t('tools.tokenCounter.result')}
        actions={<CopyButton value={state.text} />}
        contentClassName="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">
              {t('tools.tokenCounter.tokenCount')}
            </div>
            <div className="mt-2 text-3xl font-bold">{result.tokenCount.toLocaleString()}</div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">
              {t('tools.tokenCounter.characterCount')}
            </div>
            <div className="mt-2 text-3xl font-bold">{result.characterCount.toLocaleString()}</div>
          </div>
        </div>

        {state.text && (
          <div className="text-xs text-muted-foreground">
            {t('tools.tokenCounter.ratio', {
              ratio: (result.tokenCount / result.characterCount).toFixed(3),
            })}
          </div>
        )}
      </ToolSection>
    </ToolPage>
  );
}
