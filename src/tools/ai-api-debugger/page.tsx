import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolPage, ToolSection } from '@/components/tool-ui';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToolPersistence } from '@/hooks/useToolPersistence';
import { sendChatRequest, extractAssistantMessage, validateConfig } from './logic';
import { Send, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiDebuggerState {
  baseUrl: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}

export default function AiApiDebuggerPage() {
  const { t } = useTranslation();

  const [state, setState] = useToolPersistence<ApiDebuggerState>('ai-api-debugger', {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o',
    systemPrompt: '',
    userPrompt: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleSend = async () => {
    // Validate configuration
    const validationError = validateConfig({
      baseUrl: state.baseUrl,
      apiKey: state.apiKey,
      model: state.model,
    });

    if (validationError) {
      setError(validationError);
      setResponse('');
      return;
    }

    if (!state.userPrompt.trim()) {
      setError(t('tools.aiApiDebugger.userPromptRequired'));
      setResponse('');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      // Build messages array
      const messages = [];
      if (state.systemPrompt.trim()) {
        messages.push({
          role: 'system' as const,
          content: state.systemPrompt,
        });
      }
      messages.push({
        role: 'user' as const,
        content: state.userPrompt,
      });

      const result = await sendChatRequest(
        {
          baseUrl: state.baseUrl,
          apiKey: state.apiKey,
          model: state.model,
        },
        messages
      );

      if (result.success) {
        const assistantMessage = extractAssistantMessage(result);
        setResponse(result.rawResponse || '');
        if (assistantMessage) {
          // Optionally show just the message instead of full JSON
          // setResponse(assistantMessage);
        }
      } else {
        setError(result.error || 'Unknown error');
        if (result.rawResponse) {
          setResponse(result.rawResponse);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPage
      title={t('tools.aiApiDebugger.title')}
      description={t('tools.aiApiDebugger.description')}
    >
      <ToolSection contentClassName="space-y-4">
        <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>{t('tools.aiApiDebugger.configuration')}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isConfigOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('tools.aiApiDebugger.baseUrlLabel')}
              </label>
              <Input
                type="url"
                value={state.baseUrl}
                onChange={(e) => setState({ baseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
              <p className="text-xs text-muted-foreground">
                {t('tools.aiApiDebugger.baseUrlHint')}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('tools.aiApiDebugger.apiKeyLabel')}
              </label>
              <Input
                type="password"
                value={state.apiKey}
                onChange={(e) => setState({ apiKey: e.target.value })}
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground">
                {t('tools.aiApiDebugger.apiKeyHint')}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('tools.aiApiDebugger.modelLabel')}
              </label>
              <Input
                value={state.model}
                onChange={(e) => setState({ model: e.target.value })}
                placeholder="gpt-4o"
              />
              <p className="text-xs text-muted-foreground">
                {t('tools.aiApiDebugger.modelHint')}
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {t('tools.aiApiDebugger.securityNotice')}
              </AlertDescription>
            </Alert>
          </CollapsibleContent>
        </Collapsible>
      </ToolSection>

      <ToolSection
        title={t('tools.aiApiDebugger.messages')}
        contentClassName="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('tools.aiApiDebugger.systemPromptLabel')}
          </label>
          <Textarea
            value={state.systemPrompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setState({ systemPrompt: e.target.value })}
            placeholder={t('tools.aiApiDebugger.systemPromptPlaceholder')}
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('tools.aiApiDebugger.userPromptLabel')}
          </label>
          <Textarea
            value={state.userPrompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setState({ userPrompt: e.target.value })}
            placeholder={t('tools.aiApiDebugger.userPromptPlaceholder')}
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        <Button onClick={handleSend} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('tools.aiApiDebugger.sending')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t('tools.aiApiDebugger.send')}
            </>
          )}
        </Button>
      </ToolSection>

      {(response || error) && (
        <ToolSection
          title={t('tools.aiApiDebugger.response')}
          contentClassName="space-y-4"
        >
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {response && (
            <div className="rounded-lg border bg-muted p-4">
              <pre className="overflow-x-auto text-xs">
                <code>{response}</code>
              </pre>
            </div>
          )}
        </ToolSection>
      )}
    </ToolPage>
  );
}
